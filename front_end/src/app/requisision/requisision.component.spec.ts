import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisisionComponent } from './requisision.component';

describe('RequisisionComponent', () => {
  let component: RequisisionComponent;
  let fixture: ComponentFixture<RequisisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequisisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
