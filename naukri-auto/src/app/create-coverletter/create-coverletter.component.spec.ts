import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCoverletterComponent } from './create-coverletter.component';

describe('CreateCoverletterComponent', () => {
  let component: CreateCoverletterComponent;
  let fixture: ComponentFixture<CreateCoverletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCoverletterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCoverletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
