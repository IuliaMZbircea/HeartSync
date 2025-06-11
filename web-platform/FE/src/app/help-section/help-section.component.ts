import {Component, HostListener} from '@angular/core';
import {NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {Page1Component} from "./pages/page1/page1.component";
import {Page4Component} from "./pages/page4/page4.component";
import {Page3Component} from "./pages/page3/page3.component";
import {Page2Component} from "./pages/page2/page2.component";
import {Page5Component} from "./pages/page5/page5.component";
import {Page6Component} from "./pages/page6/page6.component";

@Component({
  selector: 'app-help-section',
  standalone: true,
  imports: [
    NgForOf,
    NgSwitchDefault,
    Page1Component,
    NgSwitch,
    NgSwitchCase,
    Page4Component,
    Page3Component,
    Page2Component,
    Page5Component,
    Page6Component
  ],
  templateUrl: './help-section.component.html',
  styleUrl: './help-section.component.css'
})
export class HelpSectionComponent {
  currentIndex = 0;
  totalPages = 3;
  isAnimating = false;

  @HostListener('window:wheel', ['$event'])
  onScroll(event: WheelEvent) {
    if (this.isAnimating) return;

    if (event.deltaY > 0 && this.currentIndex < this.totalPages - 1) {
      this.nextPage();
    } else if (event.deltaY < 0 && this.currentIndex > 0) {
      this.prevPage();
    }
  }

  nextPage() {
    this.isAnimating = true;
    this.currentIndex++;
    setTimeout(() => (this.isAnimating = false), 700);
  }

  prevPage() {
    this.isAnimating = true;
    this.currentIndex--;
    setTimeout(() => (this.isAnimating = false), 700);
  }
}
