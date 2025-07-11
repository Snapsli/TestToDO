import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MaterialModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TestTODO';
}
