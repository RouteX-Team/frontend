import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FavoritesPage } from './favorites-page';
import { Favorite } from '../../shared/models/notification.model';

const sample: Favorite = {
  id: 1,
  routeId: 5,
  routeNumber: 'R1',
  routeName: 'Campus Loop',
  createdAt: '2026-01-01T00:00:00Z',
};

describe('FavoritesPage', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads favorites on init', () => {
    const fixture = TestBed.createComponent(FavoritesPage);
    const cmp = fixture.componentInstance;

    const req = http.expectOne('/api/favorites');
    expect(req.request.method).toBe('GET');
    req.flush([sample]);

    expect(cmp.loading()).toBe(false);
    expect(cmp.favorites().length).toBe(1);
    expect(cmp.favorites()[0].routeName).toBe('Campus Loop');
  });

  it('removes a favorite via DELETE and updates the list', () => {
    const fixture = TestBed.createComponent(FavoritesPage);
    const cmp = fixture.componentInstance;
    http.expectOne('/api/favorites').flush([sample]);

    cmp.remove(5);

    const del = http.expectOne('/api/favorites/5');
    expect(del.request.method).toBe('DELETE');
    del.flush(null);

    expect(cmp.favorites().length).toBe(0);
  });
});
