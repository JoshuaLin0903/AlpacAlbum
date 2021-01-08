import express from 'express'

const router = express.Router()

router.get('/login', (req, res) => {
	const PASSWORD = "6666"
	const enter = req.query.password

	if (enter === PASSWORD)
	{
		res.json({msg: 'Correct password'})
	}
	else if (enter === "")
	{
		res.json({msg: 'Miss password'})
	}
	else
	{
		res.json({msg: 'Wrong password'})
	}

})

export default router