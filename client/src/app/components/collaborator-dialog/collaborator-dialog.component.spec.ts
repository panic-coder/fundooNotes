import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorDialogComponent } from './collaborator-dialog.component';

describe('CollaboratorDialogComponent', () => {
  let component: CollaboratorDialogComponent;
  let fixture: ComponentFixture<CollaboratorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
