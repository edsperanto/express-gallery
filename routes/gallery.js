const express = require('express');
const sequelize = require('sequelize');
const router = express.Router();
const gen = require('../helper/gen');
const db = require('../models');
const { Photo } = db;

router.get('/new', (req, res) => {
	gen.details("1", Photo)
		.then(data => {
			data.details.creating = true;
			return data;
		})
		.then(data => res.render('detail', data));
});

router.get('/:id', (req, res) => {
	gen.details(req.params.id, Photo)
		.then(data => {
			data.details.viewing = true;
			return data;
		})
		.then(data => res.render('detail', data));
});

router.get('/:id/edit', (req, res) => {
	gen.details(req.params.id, Photo)
		.then(data => {
			data.details.editing = true;
			return data;
		})
		.then(data => res.render('detail', data));
});

router.post('/', (req, res) => {
	var {author, link, description} = req.body;
	Photo.create({author, link, description})
		.then(photo => Photo.findOne({where: {author, link, description}}))
		.then(({id}) => res.redirect(`/gallery/${id}`))
		.catch(err => {
			let errMsg = {};
			err.errors.forEach(({message, path}) => {
				errMsg[path] = message;
			});
			res.json(errMsg);
		});
});

router.put('/:id', (req, res) => {
	var {author, link, description} = req.body;
	Photo.update(
		{author, link, description},
		{where: {id: req.params.id}}
	)
		.then(_ => res.redirect(`/gallery/${req.params.id}`));
});

router.delete('/:id', (req, res) => {
	Photo.destroy({where: {id: req.params.id}})
		.then(id => {
			res.json({success: true});
		});
})

module.exports = router;