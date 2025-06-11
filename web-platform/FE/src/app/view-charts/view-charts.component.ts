import {Component, OnInit, ViewChild} from '@angular/core';
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

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Puls (bătăi/minut)',
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
          text: 'Bătăi pe minut'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Ora'
        }
      }
    }
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam && !isNaN(+idParam) ? Number(idParam) : null;

    if (id !== null) {
      this.patientService.getPatients().subscribe((patients: Patient[]) => {
        const found = patients.find(p => p.id === id);
        if (found) {
          this.patient = found;
          this.patientService.getPulseById(id).subscribe(
            data => {
              this.pulseData = data.slice(0, 5);

              this.lineChartData.labels = this.pulseData.map((entry: any) => {
                const time = new Date(entry.created_at);
                return `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`;
              });

              this.lineChartData.datasets[0].data = this.pulseData.map((entry: any) => entry.pulse);

              this.chart?.update();
            },
            error => console.error('Eroare la preluarea datelor:', error)
          );
        } else {
          console.warn(`Patient with ID ${id} not found.`);
        }
      });
    } else {
      console.error('Invalid or missing patient ID in route.');
    }
  }
}
