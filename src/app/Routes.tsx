import React from 'react';
import { AddPets } from 'features/pets/AddPets';
import { EditPet } from 'features/pets/EditPet';
import { ViewPets } from 'features/pets/ViewPets';
import { ViewPet } from 'features/pets/ViewPet';
import { Switch, Route } from 'react-router-dom';

export const Routes: React.FC = () => (
  <Switch>
    <Route path="/edit/:id" component={EditPet} />
    <Route path="/add" component={AddPets} />
    <Route path="/:id" component={ViewPet} />
    <Route path="/" component={ViewPets} />
  </Switch>
);
