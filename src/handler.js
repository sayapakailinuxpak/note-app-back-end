const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
	const { title, tags, body } = request.payload;
	const id = nanoid(16);
	const createdAt = new Date().toISOString();
	const updatedAt = createdAt;

	const newNote = {
		id, createdAt, updatedAt, title, tags, body,
	};
	notes.push(newNote);

	const isSuccess = notes.filter((note) => note.id === id).length > 0;
	const message = isSuccess ? "Catatan berhasil ditambahkan" : "Catatan gagal ditambahkan";


	if (isSuccess) {
		const response = h.response({
			status: 'success',
			message: message,
			data: {
				noteId: id
			},
		}).code(201);
		return response;
	}

	const response = h.response({
		status: 'fail',
		message: message,
	}).code(500);
	return response;
}


const getAllNotesHandler = () => ({
	status: 'success',
	data: {
		notes,
	},
});

const getNoteByIdHandler = (request, h) => {
	const {id} = request.params;
	const note = notes.filter((note) => note.id === id)[0];

	if (note !== undefined) {
		return {
			status: 'success',
			data: {
				note,
			}
		}
	}
	const response = h.response({
		status: 'fail',
		message: 'Catatan tidak ditemukan'

	}).code(404);	
	return response;
};

const editNoteByIdHandler = (request, h) => {
	const { id } = request.params;
	const { title, tags, body } = request.payload;
	const updatedAt = new Date().toISOString();

	const noteIndex = notes.findIndex((note) => note.id === id);

	if (noteIndex !== -1) {
		notes[noteIndex] = {
			...notes[noteIndex],
			title,
			tags,
			body,
			updatedAt,
		};

		const response = h.response({
			status: 'success',
			message: 'Catatan berhasil diperbarui'
		}).code(200);

		return response;
	}



	const response = h.response({
		status: 'fail',
		message: 'Catatan gagal diperbarui, id tidak ditemukan'
	}).code(404);

	return response;


}

const deleteNoteByIdHandler = (request, h) => {
	const { id } = request.params;
	const noteIndex = notes.findIndex((note) => note.id === id);

	if (noteIndex !== -1) {
		notes.splice(noteIndex, 1);
		const response = h.response({
			status: 'success',
			message: 'Catatan berhasil dihapus',
		}).code(200);

		return response;
	}

	const response = h.response({
		status: 'fail',
		message: 'Catatan gagal dihapus, id tidak ditemukan',
	}).code(404);

	return response;
}

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };