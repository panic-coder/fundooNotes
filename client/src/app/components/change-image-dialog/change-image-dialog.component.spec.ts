import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeImageDialogComponent } from './change-image-dialog.component';

describe('ChangeImageDialogComponent', () => {
  let component: ChangeImageDialogComponent;
  let fixture: ComponentFixture<ChangeImageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeImageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
