const { error } = require('console');
const Userdata = require('../model/employeeModel')
const fs = require('fs');


class AlluserData {
    async createdata(req, res) {
        // console.log(req.body);

        try {
            const { name, email, phone, city, } = req.body;


            const image = req.file ? req.file.path.replace(/\\/g, "/") : null;
            if (!image) {
                return res.status(400).json({ message: 'Image is required' });
            }

            const newDataCreate = new Userdata({ name, email, phone, city, image })

            const allData = await newDataCreate.save()

            return res.status(201).json({
                success: true,
                message: "User data created successful",
                data: allData
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                stack: error.stack
            })
        }
    }

    async getalldata(req, res) {
        try {
            const alldataget = await Userdata.find()
            if (alldataget.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "User data not found"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Get all User data",
                total: alldataget.length,
                data: alldataget

            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async getoneuserid(req, res) {
        console.log(req.body);
        try {
            const getid = await Userdata.findById(req.params.id)
            if (!getid) {
                return res.status(400).json({
                    success: false,
                    message: "User data not found"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Get User data",
                data: getid

            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async updateuserdata(req, res) {
        // console.log(req.body);

        try {
            const id = req.params.id

            const { name, email, phone, city, status } = req.body;

            const updateData = { name, email, phone, city, status };

            const currentUser = await Userdata.findById(id)

            if (!currentUser) {
                return res.status(400).json({
                    success: false,
                    message: 'user not found'
                });
            }

            const oldImagePath = currentUser.image; // old image path

            if (req.file) {

                if (oldImagePath && fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath)
                }
                updateData.image = req.file.path;

            } else {
                updateData.image = oldImagePath
            }


            const updatedata = await Userdata.findByIdAndUpdate(id, updateData, { new: true })

            if (!updatedata) {
                return res.status(400).json({
                    success: false,
                    message: "User data not found"
                })
            }
            return res.status(200).json({
                success: true,
                message: "User data updated successfully",
                data: updatedata

            })

        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async deletedata(req, res) {
        try {


            const id = req.params.id
            const olddata = await Userdata.findById(id)
            if (!olddata) {
                return res.status(400).json({
                    success: false,
                    message: 'user not fount'
                })
            }
            if (olddata.image && fs.existsSync(olddata.image)) {
                fs.unlinkSync(olddata.image)
            }

            await Userdata.findByIdAndDelete(id);

            return res.status(200).json({
                success: true,
                message: 'User data deleted seccessfully'
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async togglestatus(req, res) {
        try {
            const id = req.params.id
            const data = await Userdata.findById(id)
            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: 'User not found'
                })
            }

            data.status = data.status === "Active" ? "Inactive" : "Active";
            const updateuser = await data.save();

            return res.status(200).json({
                success: true,
                message: 'Status toggled successfully',
                data: updateuser
            })


        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }


    }

}
module.exports = new AlluserData()