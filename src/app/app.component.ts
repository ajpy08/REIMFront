import { Component, OnInit } from '@angular/core';
import { SettingsService } from './services/service.index';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // constructor(public _ajustes: SettingsService, private sw: UpdateService) {}
  constructor(public _ajustes: SettingsService, private swUpdate: SwUpdate) {}

  ngOnInit() {
    // check the service worker for updates
    // this.sw.checkForUpdates();

    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe((event: UpdateAvailableEvent) => {
        if (confirm('Nueva Version Disponible. Cargar Nueva Version?')) {
         this.swUpdate.checkForUpdate();
          window.location.reload();
        }
      });
    }
  }
}

// export class UpdateService {
//   constructor(public updates: SwUpdate) {
//     if (updates.isEnabled) {
//       interval(6 * 60 * 60).subscribe(() =>
//         updates.checkForUpdate().then(() => console.log('Checking for Updates'))
//       );
//     }
//   }

//   public checkForUpdates(): void {
//     this.updates.available.subscribe(event => this.promptUser());
//   }

//   private promptUser(): void {
//     console.log('Updating to New Version');
//     this.updates.activateUpdate().then(() => document.location.reload());
//   }
// }
