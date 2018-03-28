import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TGamPDFComponent } from './tgam-pdf.component';

describe('TGamPDFComponent', () => {
  let component: TGamPDFComponent;
  let fixture: ComponentFixture<TGamPDFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TGamPDFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TGamPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
