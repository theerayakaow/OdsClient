import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App'; 

describe('App Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('app-root')).toBeTruthy();
  });
});
