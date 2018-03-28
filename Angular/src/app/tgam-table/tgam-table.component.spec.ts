import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TGamTableComponent } from './tgam-table.component';

describe('TGamTableComponent', () => {
  let component: TGamTableComponent;
  let fixture: ComponentFixture<TGamTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TGamTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TGamTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
