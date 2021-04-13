import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private authService: AuthService,
    private navController: NavController,
    private menuController: MenuController) {}

  signOut() {
    this.authService.signOut();
    this.navController.navigateRoot("login");
  }

  closeMenu() {
    this.menuController.close();
  }
}
