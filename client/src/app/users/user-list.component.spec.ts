import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockUserService } from '../../testing/user.service.mock';
import { User } from './user';
import { UserCardComponent } from './user-card.component';
import { UserListComponent } from './user-list.component';
import { UserService } from './user.service';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('UserListComponent', () => {

  let userList: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [UserListComponent, UserCardComponent],
      // providers:    [ UserService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      // This MockerUserService is defined in client/testing/user.service.mock.
      providers: [{ provide: UserService, useValue: new MockUserService() }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      // Create a "fixture" of the UserListComponent. that
      // allows us to get an instance of the component
      // (userList, below) that we can "control" in
      // the tests.
      fixture = TestBed.createComponent(UserListComponent);
      userList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the users', () => {
    expect(userList.serverFilteredUsers.length).toBe(3);
  });

  it('contains a user named "Chris"', () => {
    expect(userList.serverFilteredUsers.some((user: User) => user.name === 'Chris')).toBe(true);
  });

  it('contains a user named "Jamie"', () => {
    expect(userList.serverFilteredUsers.some((user: User) => user.name === 'Jamie')).toBe(true);
  });

  it('doesn\'t contain a user named "Santa"', () => {
    expect(userList.serverFilteredUsers.some((user: User) => user.name === 'Santa')).toBe(false);
  });

  it('has two users that are 37 years old', () => {
    expect(userList.serverFilteredUsers.filter((user: User) => user.age === 37).length).toBe(2);
  });
});

/*
 * This test is a little odd, but illustrates how we can use "stubbing"
 * to create mock objects (a service in this case) that be used for
 * testing. Here we set up the mock UserService (userServiceStub) so that
 * _always_ fails (throws an exception) when you request a set of users.
 *
 * So this doesn't really test anything meaningful in the context of our
 * code (I certainly wouldn't copy it), but it does illustrate some nice
 * testing tools. Hopefully it's useful as an example in that regard.
 */
describe('Misbehaving User List', () => {
  let userList: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  let userServiceStub: {
    getUsers: () => Observable<User[]>;
    getUsersFiltered: () => Observable<User[]>;
  };

  beforeEach(() => {
    // stub UserService for test purposes
    userServiceStub = {
      getUsers: () => new Observable(observer => {
        observer.error('Error-prone observable');
      }),
      getUsersFiltered: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [UserListComponent],
      // providers:    [ UserService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: UserService, useValue: userServiceStub }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(UserListComponent);
      userList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('fails to load users if we do not set up a UserListService', () => {
    // Since calling both getUsers() and getUsersFiltered() return
    // Observables that then throw exceptions, we don't expect the component
    // to be able to get a list of users, and serverFilteredUsers should
    // be undefined.
    expect(userList.serverFilteredUsers).toBeUndefined();
  });
});
