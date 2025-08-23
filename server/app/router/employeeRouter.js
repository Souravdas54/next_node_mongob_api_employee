const express = require('express')
const router = express.Router()

const Allemployeedata = require('../controller/employeeController')
const upload = require('../helper/multer')

router.post('/create', upload.single('image'), Allemployeedata.createdata)
router.get('/list', Allemployeedata.getalldata)

router.get('/edit/:id', Allemployeedata.getoneuserid)

router.put('/update/:id', upload.single('image'), Allemployeedata.updateuserdata)

router.delete('/delete/:id', Allemployeedata.deletedata)

router.patch('/toggle/status/:id', Allemployeedata.togglestatus)

module.exports = router