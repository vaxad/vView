import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import VideoCard from './VideoCard'; // import the component you want to test

test('renders button with correct text', () => {
    const { getByText } = render(<VideoCard filePath={"/videos/Test Path.mp4"} />);
    const button = getByText('Test Path');
    expect(button).toBeInTheDocument();
  });
  
  test('calls onClick when button is clicked', () => {
    const onClick = jest.fn();
    const { getByText } = render(<VideoCard filePath={"/videos/Test Path.mp4"} />);
    const button = getByText('Test Path');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
  