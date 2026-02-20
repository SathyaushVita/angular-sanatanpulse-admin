import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionupdateComponent } from './productionupdate.component';

describe('ProductionupdateComponent', () => {
  let component: ProductionupdateComponent;
  let fixture: ComponentFixture<ProductionupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionupdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
