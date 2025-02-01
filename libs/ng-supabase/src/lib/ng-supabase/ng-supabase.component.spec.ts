import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgSupabaseComponent } from './ng-supabase.component';

describe('NgSupabaseComponent', () => {
  let component: NgSupabaseComponent;
  let fixture: ComponentFixture<NgSupabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgSupabaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgSupabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
