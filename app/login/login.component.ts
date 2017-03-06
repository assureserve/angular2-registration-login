import{Component, OnInit}from '@angular/core';
import {Router, ActivatedRoute}from '@angular/router';

import {AlertService, AuthenticationService, UserService}from '../_services/index';

import {User} from '../_models/user';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    declare const gapi: any;
  public auth2: any;
  public googleInit() {
  let that = this;
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'client_id': '951836066188-27du1lah7q4i5fskvdmvb5v66llmsahd.apps.googleusercontent.com',
        'cookiepolicy': 'single_host_origin',
        'onsuccess': param => that.onSignIn(param)
    });
    /*let that = this;
    gapi.load('auth2', function () {
      that.auth2 = gapi.auth2.init({
        client_id: '951836066188-27du1lah7q4i5fskvdmvb5v66llmsahd.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      that.attachSignin(document.getElementById('googleBtn'));
    });*/
  }

  public onSignIn(googleUser) {
  let that = this;
  //alert(1)
    var user : User = new User();

    ((u, p) => {
        u.id            = p.getId();
        u.name          = p.getName();
        u.email         = p.getEmail();
        u.imageUrl      = p.getImageUrl();
        u.givenName     = p.getGivenName();
        u.familyName    = p.getFamilyName();
    })(user, googleUser.getBasicProfile());

    ((u, r) => {
        u.token         = r.id_token
    })(user, googleUser.getAuthResponse());

    //user.save();
    //this.goHome();
    //that.router.navigate(['/user']);
    //return false;
    //alert(user.id);
    //console(this.login)

    this.loading = true;
    //alert(this.authenticationService.login);
    this.userService.create(user)
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    //this.authenticationService.login(user);
//        this.authenticationService.login(user.email, user.email)
//            .subscribe(
//                data => {
//                    this.router.navigate([this.returnUrl]);
//                },
//                error => {
//                    this.alertService.error(error);
//                    this.loading = false;
//                });
};

  public attachSignin(element) {
    let that = this;
    this.auth2.attachClickHandler(element, {},
      function (googleUser) {

        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        //YOUR CODE HERE


      }, function (error) {
        console.log(JSON.stringify(error, undefined, 2));
      });
  }

  ngAfterViewInit(){
    this.googleInit();
  }
}
