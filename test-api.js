async function runTests() {
  const baseUrl = 'http://localhost:3000';

  console.log('=== PENGUJIAN QUERY PARAMS VALIDATION DENGAN JOI ===\n');

  // Persiapan data catatan untuk pengujian filter
  console.log('--- PERSIAPAN DATA: Menambahkan 2 catatan ---');
  const resNote1 = await fetch(`${baseUrl}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Belajar JavaScript',
      tags: ['JS', 'Dicoding'],
      body: 'Dasar pemrograman JavaScript',
    }),
  });
  const dataNote1 = await resNote1.json();
  const note1Id = dataNote1.data.noteId;
  console.log('Note 1 created:', note1Id, 'title: Belajar JavaScript');

  const resNote2 = await fetch(`${baseUrl}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Belajar Node.js',
      tags: ['Backend', 'Express'],
      body: 'Pengembangan backend dengan Node.js',
    }),
  });
  const dataNote2 = await resNote2.json();
  const note2Id = dataNote2.data.noteId;
  console.log('Note 2 created:', note2Id, 'title: Belajar Node.js\n');

  // 1. GET /notes (seluruh notes ditampilkan)
  console.log('--- TEST 1: GET /notes ---');
  let res = await fetch(`${baseUrl}/notes`);
  let data = await res.json();
  console.log('HTTP Status:', res.status);
  console.log('Total notes:', data.data.notes.length);
  console.log('Response:', JSON.stringify(data, null, 2));

  // 2. GET /notes?title=Belajar JavaScript
  console.log('\n--- TEST 2: GET /notes?title=Belajar JavaScript ---');
  res = await fetch(`${baseUrl}/notes?title=Belajar%20JavaScript`);
  data = await res.json();
  console.log('HTTP Status:', res.status);
  console.log('Matched notes:', data.data.notes.length);
  console.log('Response:', JSON.stringify(data, null, 2));

  // 3. GET /notes?title=JudulTidakAda
  console.log('\n--- TEST 3: GET /notes?title=JudulTidakAda ---');
  res = await fetch(`${baseUrl}/notes?title=JudulTidakAda`);
  data = await res.json();
  console.log('HTTP Status:', res.status);
  console.log('Matched notes (expected 0):', data.data.notes.length);
  console.log('Response:', JSON.stringify(data, null, 2));

  // 4. GET /notes?title=
  console.log('\n--- TEST 4: GET /notes?title= ---');
  res = await fetch(`${baseUrl}/notes?title=`);
  data = await res.json();
  console.log('HTTP Status:', res.status);
  console.log('Total notes (expected all):', data.data.notes.length);
  console.log('Response:', JSON.stringify(data, null, 2));

  // 5. GET /notes?title=Android&title=Web (Array, bukan string)
  console.log('\n--- TEST 5: GET /notes?title=Android&title=Web ---');
  res = await fetch(`${baseUrl}/notes?title=Android&title=Web`);
  data = await res.json();
  console.log('HTTP Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  // 6. GET /notes?unknown=value (Parameter tidak dikenal)
  console.log('\n--- TEST 6: GET /notes?unknown=value ---');
  res = await fetch(`${baseUrl}/notes?unknown=value`);
  data = await res.json();
  console.log('HTTP Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  // 7. POST /notes (validasi request body tetap berjalan)
  console.log('\n--- TEST 7: POST /notes (Validasi body) ---');
  // 7a. POST valid
  res = await fetch(`${baseUrl}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Catatan Valid Baru',
      tags: ['Testing'],
      body: 'Konten valid',
    }),
  });
  data = await res.json();
  console.log('POST valid - HTTP Status:', res.status, 'data:', data.data);

  // 7b. POST invalid (tanpa title)
  res = await fetch(`${baseUrl}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tags: ['Testing'],
      body: 'Konten tanpa title',
    }),
  });
  data = await res.json();
  console.log('POST invalid - HTTP Status:', res.status, 'message:', data.message);

  // 8. PUT /notes/:id (validasi request body tetap berjalan)
  console.log('\n--- TEST 8: PUT /notes/:id (Validasi body) ---');
  // 8a. PUT valid
  res = await fetch(`${baseUrl}/notes/${note1Id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Belajar JavaScript (Revisi)',
      tags: ['JS', 'ES6'],
      body: 'Konten telah diperbarui',
    }),
  });
  data = await res.json();
  console.log('PUT valid - HTTP Status:', res.status, 'message:', data.message);

  // 8b. PUT invalid (tanpa body)
  res = await fetch(`${baseUrl}/notes/${note1Id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Judul Saja',
      tags: ['JS'],
    }),
  });
  data = await res.json();
  console.log('PUT invalid - HTTP Status:', res.status, 'message:', data.message);

  // 9. GET /notes/:id (detail notes tetap berjalan)
  console.log('\n--- TEST 9: GET /notes/:id ---');
  res = await fetch(`${baseUrl}/notes/${note1Id}`);
  data = await res.json();
  console.log('HTTP Status:', res.status);
  console.log('Response detail:', data.data ? data.data.note.title : 'Not found');

  // 10. DELETE /notes/:id (penghapusan notes tetap berjalan)
  console.log('\n--- TEST 10: DELETE /notes/:id ---');
  res = await fetch(`${baseUrl}/notes/${note1Id}`, { method: 'DELETE' });
  data = await res.json();
  console.log('HTTP Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  // Verifikasi bahwa note1 sudah terhapus
  res = await fetch(`${baseUrl}/notes/${note1Id}`);
  console.log('GET note yang sudah dihapus - HTTP Status:', res.status);
}

runTests().catch(console.error);
