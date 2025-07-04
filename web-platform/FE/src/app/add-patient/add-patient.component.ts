import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { IcdService } from "../../services/diagnosis.code.service";
import { PatientService } from "../../services/patient.service";
import { AlertService } from "../../services/alert.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  providers: [IcdService, AlertService],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css'
})
export class AddPatientComponent implements OnInit {
  patientForm!: FormGroup;
  age: number | null = null;
  sex: string | null = null;
  cnpError: string | null = null;
  isRecording = false;
  currentRecordingSection: string | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      cnp: ['', [Validators.required, Validators.pattern(/^\d{13}$/), this.cnpValidator()]],
      occupation: ['', Validators.required],
      locality: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      block: ['', Validators.pattern(/^[A-Za-z0-9]+$/)],
      staircase: ['', Validators.pattern(/^\d+$/)],
      apartment: ['', Validators.min(1)],
      floor: ['', Validators.min(1)],
      bloodGroup: ['', Validators.required],
      rh: ['', Validators.required],
      weight: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      height: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      birthDate: [{ value: '', disabled: true }],
      sex: [{ value: '', disabled: true }],
    });

    this.patientForm.get('cnp')?.valueChanges.subscribe(val => {
      this.validateAndExtractCNP(val);
    });
  }

  async startSectionRecording(section: string): Promise<void> {
    if (this.isRecording) {
      this.stopRecording();
      return;
    }

    this.currentRecordingSection = section;
    this.isRecording = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        await this.processRecording(audioBlob, section);
        stream.getTracks().forEach(track => track.stop());
      };

      this.askSectionQuestions(section);

      this.mediaRecorder.start();
      setTimeout(() => {
        if (this.isRecording) {
          this.stopRecording();
        }
      }, 30000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      this.alertService.error('Microphone access denied. Please allow microphone access.');
      this.stopRecording();
    }
  }

  async askSectionQuestions(section: string): Promise<void> {
    const fieldQuestions: { question: string, field: string }[] = [];

    if (section === 'contact') {
      fieldQuestions.push(
        { question: "Please say the email address.", field: "email" },
        { question: "Now please say the phone number.", field: "phone" }
      );
    } else if (section === 'personal') {
      fieldQuestions.push(
        { question: "Please say the first name.", field: "firstName" },
        { question: "Now please say the last name.", field: "lastName" },
        { question: "Please say the CNP number.", field: "cnp" },
        { question: "Please say the occupation.", field: "occupation" }

      );
    } else if (section === 'address') {
      fieldQuestions.push(
        { question: "Please say the city.", field: "locality" },
        { question: "Now please say the street name.", field: "street" },
        { question: "Please say the number.", field: "number" }
      );
    } else if (section === 'medical') {
      fieldQuestions.push(
        { question: "Please say the blood group.", field: "bloodGroup" },
        { question: "Now please say the RH factor.", field: "rh" },
        { question: "Please say the height.", field: "height" },
        { question: "Please say the weight.", field: "weight" }

    );
    }

    for (const { question, field } of fieldQuestions) {
      await this.askAndFillFieldWithPauseDetection(question, field);
    }

    this.stopRecording();
  }

  askAndFillFieldWithPauseDetection(question: string, formField: string): Promise<void> {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(question);
      synth.speak(utterance);

      utterance.onend = () => {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        let resolved = false;

        const silenceTimeout = setTimeout(() => {
          if (!resolved) {
            recognition.abort();
            this.alertService.info("No response detected. Moving to the next field.");
            resolved = true;
            resolve();
          }
        }, 8000);

        recognition.onstart = () => {
          console.log(`🎤 Listening for: ${formField}`);
        };

        recognition.onspeechend = () => {
          clearTimeout(silenceTimeout);
          recognition.stop();
        };

        recognition.onresult = (event: any) => {
          if (resolved) return;
          resolved = true;

          let transcript = event.results[0][0].transcript.toLowerCase().trim();

          switch (formField) {
            case 'email':
              transcript = transcript
                .replace(/ at /g, '@')
                .replace(/ at$/g, '@')
                .replace(/^at /g, '@')
                .replace(/ dot com/g, '.com')
                .replace(/ dot /g, '.')
                .replace(/\s/g, '');
              break;
            case 'phone':
            case 'cnp':
              transcript = transcript.replace(/\s+/g, '').replace(/[^\d]/g, '');
              break;
            case 'bloodGroup':
              transcript = transcript.toUpperCase().trim();

              const validGroups = ['A', 'B', 'O', 'AB'];
              let matchedGroup = validGroups.find(group =>
                transcript.includes(group) ||
                (group === 'AB' && (transcript.includes('a b') || transcript.includes('ay bee')))
              );

              if (!matchedGroup) {
                const errorMsg = new SpeechSynthesisUtterance(
                  'Invalid blood group. Please say A, B, O, or A B.'
                );
                synth.speak(errorMsg);
                errorMsg.onend = () => {
                  this.askAndFillFieldWithPauseDetection(question, formField);
                };
                return;
              }

              transcript = matchedGroup;
              break;
            case 'rh':
              transcript = transcript.includes('positive') ? '+' :
                transcript.includes('negative') ? '-' :
                  transcript;
              if (!['+', '-'].includes(transcript)) {
                this.alertService.error('Invalid RH factor. Please say "positive" or "negative".');
                resolve();
                return;
              }
              break;
            default:
              transcript = transcript.trim();
          }

          const confirmMessage = new SpeechSynthesisUtterance(`You said: ${transcript}.`);
          synth.speak(confirmMessage);

          confirmMessage.onend = () => {
            this.patientForm.patchValue({ [formField]: transcript });
            resolve();
          };
        };

        recognition.onerror = (event: any) => {
          clearTimeout(silenceTimeout);
          if (!resolved) {
            resolved = true;
            this.alertService.info(`Could not recognize speech for ${formField}: ${event.error}`);
            resolve();
          }
        };

        recognition.start();
      };
    });
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.isRecording = false;
    this.currentRecordingSection = null;
    window.speechSynthesis.cancel();
  }

  async processRecording(audioBlob: Blob, section: string): Promise<void> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('section', section);
  }

  validateAndExtractCNP(cnp: string): void {
    this.age = null;
    this.sex = null;
    this.cnpError = null;

    this.patientForm.patchValue({ birthDate: '', sex: '' });

    const genderCode = parseInt(cnp[0], 10);
    const year = parseInt(cnp.slice(1, 3), 10);
    const month = parseInt(cnp.slice(3, 5), 10);
    const day = parseInt(cnp.slice(5, 7), 10);

    if (month < 1 || month > 12) {
      this.cnpError = 'Invalid month in CNP.';
      this.patientForm.patchValue({ birthDate: '', sex: '' });
      return;
    }

    if (day < 1 || day > 31) {
      this.cnpError = 'Invalid day in CNP.';
      this.patientForm.patchValue({ birthDate: '', sex: '' });
      return;
    }

    let fullYear: number;
    let genderText: string;

    switch (genderCode) {
      case 1:
      case 2:
        fullYear = 1900 + year;
        genderText = (genderCode === 1) ? 'M' : 'F';
        break;
      case 3:
      case 4:
        fullYear = 1800 + year;
        genderText = (genderCode === 3) ? 'M' : 'F';
        break;
      case 5:
      case 6:
        fullYear = 2000 + year;
        genderText = (genderCode === 5) ? 'M' : 'F';
        break;
      case 7:
      case 8:
        const currentYear = new Date().getFullYear() % 100;
        fullYear = (year > currentYear) ? 1900 + year : 2000 + year;
        genderText = 'Unknown';
        break;
      case 9:
        fullYear = 1900 + year;
        genderText = 'Unknown';
        break;
      default:
        this.cnpError = 'Unknown gender code in CNP.';
        this.patientForm.patchValue({ birthDate: '', sex: '' });
        return;
    }

    const birthDate = new Date(fullYear, month - 1, day);

    if (
      birthDate.getFullYear() !== fullYear ||
      birthDate.getMonth() !== month - 1 ||
      birthDate.getDate() !== day
    ) {
      this.cnpError = 'Invalid birth date in CNP.';
      this.patientForm.patchValue({ birthDate: '', sex: '' });
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - fullYear;
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 0 || age > 120) {
      this.cnpError = 'Age derived from CNP is out of valid range.';
      this.patientForm.patchValue({ birthDate: '', sex: '' });
      return;
    }

    this.sex = genderText;
    this.age = age;

    this.patientForm.patchValue({
      birthDate: this.formatDateLocal(birthDate),
      sex: genderText
    });
  }

  private formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cnpValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cnp = control.value;
      if (!cnp) return null;
      const valid = /^\d{13}$/.test(cnp);
      return valid ? null : { invalidCNP: true };
    };
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      const patientData = this.patientForm.getRawValue();
      this.patientService.createPatient(patientData).subscribe({
        next: (response) => {
          this.alertService.success('Patient successfully created!');
          this.patientForm.reset();
          this.router.navigate(['/PatientList']);
        },
        error: (error) => {
          this.alertService.error('Failed to create patient. Please try again.');
          console.error('Error creating patient:', error);
        }
      });
    } else {
      this.alertService.error('Form is invalid. Please check all required fields.');
      this.patientForm.markAllAsTouched();
    }
  }
}
