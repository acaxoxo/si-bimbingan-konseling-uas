import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddJenisPelanggaran from '../AddJenisPelanggaran';

// Mock the api module
jest.mock('../../../lib/axios', () => ({
  post: jest.fn(),
  get: jest.fn(() => Promise.resolve({ data: [] })),
}));

// Mock notify wrapper
jest.mock('../../../lib/notify', () => ({
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
}));

import api from '../../../lib/axios';
import notify from '../../../lib/notify';

describe('AddJenisPelanggaran', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows inline error and toast when server returns 409 conflict', async () => {
    // make api.post reject with 409 response
    api.post.mockRejectedValueOnce({
      response: {
        status: 409,
        data: {
          message: 'Conflict',
          fields: { nama_jenis_pelanggaran: 'Nama jenis pelanggaran sudah terdaftar' },
        },
      },
    });

    render(
      <MemoryRouter>
        <AddJenisPelanggaran />
      </MemoryRouter>
    );

    // Fill form
    fireEvent.change(screen.getByRole('textbox', { name: /Nama Pelanggaran/i }), {
      target: { value: 'Merokok di area sekolah' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: /Kategori/i }), {
      target: { value: 'Berat' },
    });
    fireEvent.change(screen.getByLabelText(/Poin Pelanggaran/i), {
      target: { value: '50' },
    });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Simpan Data/i }));

    await waitFor(() => {
      expect(notify.error).toHaveBeenCalledWith(expect.stringContaining('Gagal menambahkan data'));
    });

    // inline error should be visible
    expect(screen.getByText(/Nama jenis pelanggaran sudah terdaftar/i)).toBeInTheDocument();
  });

  test('shows general error banner when server returns 409 without fields', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        status: 409,
        data: {
          message: 'Conflict',
          errors: ['Duplicate entry']
        },
      },
    });

    render(
      <MemoryRouter>
        <AddJenisPelanggaran />
      </MemoryRouter>
    );

    // Fill required fields
    fireEvent.change(screen.getByRole('textbox', { name: /Nama Pelanggaran/i }), {
      target: { value: 'Merokok di area sekolah' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: /Kategori/i }), {
      target: { value: 'Berat' },
    });
    fireEvent.change(screen.getByLabelText(/Poin Pelanggaran/i), {
      target: { value: '50' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Simpan Data/i }));

    await waitFor(() => {
      expect(notify.error).toHaveBeenCalledWith(expect.stringContaining('Gagal menambahkan data'));
    });

    // General banner should be present (role=alert)
    expect(screen.getByRole('alert')).toHaveTextContent(/Conflict/i);
  });
});
