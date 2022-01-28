import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as <%= classify(name) %>Actions from './<%= dasherize(name)%>.actions';
import { concatMap, map, of } from 'rxjs';

@Injectable()
export class <%= classify(name) %>Effects {

  // public setSomeProp$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(<%= classify(name) %>Actions.setSomeProp),
  //     concatMap(action => {
  //
  //     }),
  //   );
  // });

  constructor(
    private actions$: Actions,
  ) {}

}
