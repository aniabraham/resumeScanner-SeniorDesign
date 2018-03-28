import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TGamPdfViewerComponent } from './tgam-pdf-viewer.component';

describe('TGamPdfViewerComponent', () => {
  let component: TGamPdfViewerComponent;
  let fixture: ComponentFixture<TGamPdfViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TGamPdfViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TGamPdfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
