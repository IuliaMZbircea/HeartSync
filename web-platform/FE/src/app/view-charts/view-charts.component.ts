import { Component, OnInit, ViewChild } from '@angular/core';
import { Patient } from "../../shared/interfaces/patient";
import { ActivatedRoute } from "@angular/router";
import { PatientService } from "../../services/patient.service";
import { BaseChartDirective } from "ng2-charts";
import { ChartConfiguration, ChartOptions } from "chart.js";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-view-charts',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './view-charts.component.html',
  styleUrls: ['./view-charts.component.css']
})
export class ViewChartsComponent implements OnInit {
  patient!: Patient;
  pulseData: any;
  temperatureData: any;

  public ecgChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'ECG waveform',
        fill: false,
        borderColor: 'red',
        tension: 0,
        pointRadius: 0,
        borderWidth: 1,
      }
    ],
  };

  public ecgChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        min: -1,
        max: 1,
        title: {
          display: true,
          text: 'Tensiune (mV)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        enabled: true
      }
    }
  };

  public temperatureChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Temperature (°C)',
        fill: false,
        borderColor: 'blue',
        tension: 0.3,
      }
    ]
  };

  public temperatureChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        min: 34,
        max: 42,
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Pulse (beats/min)',
        fill: false,
        borderColor: 'red',
        tension: 0.3,
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        min: 40,
        max: 140,
        title: {
          display: true,
          text: 'Beats per minute'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };

  public humidityChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Humidity (%)',
        fill: false,
        borderColor: 'purple',
        tension: 0.3,
      }
    ]
  };

  public humidityChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Humidity (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };

  @ViewChild('pulseChart') pulseChart?: BaseChartDirective;
  @ViewChild('temperatureChart') temperatureChart?: BaseChartDirective;
  @ViewChild('ecgChart') ecgChart?: BaseChartDirective;
  @ViewChild('humidityChart') humidityChart?: BaseChartDirective;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam && !isNaN(+idParam) ? Number(idParam) : null;

    if (id !== null) {
      this.patientService.getPulseById(id).subscribe(
        data => {
          this.pulseData = data.slice(-1000).reverse();

          this.lineChartData.labels = this.pulseData.map((entry: any) => {
            const time = new Date(entry.created_at);
            return `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`;
          });

          this.lineChartData.datasets[0].data = this.pulseData.map((entry: any) => entry.pulse);

          this.pulseChart?.update(); // 👈 Important chart update
        },
        error => console.error('Error fetching pulse data:', error)
      );

      this.patientService.getTemperatureById(id).subscribe(
        tempData => {
          this.temperatureData = tempData.slice(-500).reverse();

          this.temperatureChartData.labels = this.temperatureData.map((entry: any) => {
            const time = new Date(entry.created_at);
            return `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`;
          });

          this.temperatureChartData.datasets[0].data = this.temperatureData.map((entry: any) => entry.temperature);

          this.temperatureChart?.update();
        },
        error => console.error('Error fetching temperature data:', error)
      );

      this.patientService.getECGById(id).subscribe(
        (ecg: any[]) => {
          const waveforms = ecg.map(entry => entry.waveforms);
          this.ecgChartData.labels = ecg.map(entry => {
            const t = new Date(entry.created_at);
            return `${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}:${String(t.getSeconds()).padStart(2, '0')}`;
          });
          this.ecgChartData.datasets[0].data = waveforms;


          this.ecgChart?.update();
        },
        error => console.error('Error fetching ECG data:', error)
      );

      this.patientService.getHumidityById(id).subscribe(
        humidityData => {
          const sliced = humidityData.slice(-500).reverse();

          this.humidityChartData.labels = sliced.map((entry: any) => {
            const time = new Date(entry.created_at);
            return `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`;
          });

          this.humidityChartData.datasets[0].data = sliced.map((entry: any) => entry.humidity);

          this.humidityChart?.update();
        },
        error => console.error('Error fetching humidity data:', error)
      );

    } else {
      console.error('Invalid or missing patient ID in route.');
    }
  }
}
