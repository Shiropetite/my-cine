import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, mergeMap, tap } from 'rxjs/operators';

import { FilmService } from '@shared/service/film.service';
import { Film } from '@shared/model/Film';
import { loadFilms, loadFilmsSuccess, addFilm, addFilmSuccess, updateFilm, updateFilmSuccess, deleteFilm, deleteFilmSuccess } from './film.actions';


@Injectable()
export class FilmEffects {

  constructor(
    private actions$: Actions,
    private filmService: FilmService,
    private router: Router,
  ) {}

  loadFilms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFilms),
      switchMap(() =>
        this.filmService.getAllFilm().pipe(map(films => loadFilmsSuccess({films: films}))
      )
    )
  ))

  addFilm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addFilm),
      map(action => action.film),
      mergeMap((film: Film) =>
        this.filmService.addFilm(film).pipe(map(film => addFilmSuccess({ film })))
      )
    )
  )

  addFilmSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(addFilmSuccess),
        tap(() => { this.router.navigate(["/"]) })
      ), { dispatch: false }
  )

  updateFilm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateFilm),
      map(action => action.film),
      mergeMap((film: Film) =>
        this.filmService.updateFilm(film).pipe(map(film => updateFilmSuccess({ film })))
      )
    )
  )

  updateFilmSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateFilmSuccess),
      map(action => action.film),
      tap((film) => { this.router.navigate([`/films/${film.id}`]); })
    ), { dispatch: false }
  )

  deleteFilm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteFilm),
      map(action => action.id),
      mergeMap(id =>
        this.filmService.deleteFilm(id).pipe(map(() => deleteFilmSuccess({ id })))
      )
    )
  )

  deleteFilmSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteFilmSuccess),
      map(action => action.id),
      tap(() => { this.router.navigate([`/`]); })
    ), { dispatch: false }
  )

}
