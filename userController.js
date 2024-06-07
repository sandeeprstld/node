
const client = require('../db')
const bcrypt = require('bcrypt');
exports.registerForm = async (req, res) => {

    res.render('../views/register', { message: req.flash() })

}

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {

            req.flash('error', "Name,Email and Password are required")
            return res.redirect('/signup')
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash('error', "Invalid email")
            return res.redirect('/signup')
        }

        const existQuery = {
            text: 'SELECT EXISTS(SELECT * FROM users where email=$1)',
            values: [`${email}`]

        }
        const emailExist = await client.query(existQuery)

        if (emailExist.rows[0].exists) {
            req.flash('error', `${email}` + " already exist in db")
            return res.redirect('/signup')
        }


        const passwordHash = await bcrypt.hash(password, 10);

        const query = {
            text: "INSERT INTO users(name,email,password)VALUES($1,$2,$3) RETURNING *",
            values: [`${name}`, `${email}`, `${passwordHash}`]
        }
        const result = await client.query(query);
        req.flash('success', "Successfully registered")
        res.redirect('/signup')


        
    }catch (error) {

        return res.status(500).json({ error: error.message })
    }
}

exports.login = async (req, res) => {

        res.render('../views/login',{ message: req.flash() });
    }
    exports.auth = async (req, res) => {
        try {
            const { email, password } = req.body

            if (!email || !password) {

                req.flash('error', "Email and Paswword are required")
                return res.redirect('/')
            }
            const existEmail = {
                text: 'SELECT * FROM users where email=$1',
                values: [`${email}`]

            }

            const emailExist = await client.query(existEmail)
            const count = emailExist.rows.length;

            if (count > 0) {
                const hashedPassword= emailExist.rows[0].password
                const isPasswordMatch=bcrypt.compare(password, hashedPassword)
                 if (isPasswordMatch) {
                            req.session.userId = emailExist.rows[0].id; // Set session identifier
                            return res.redirect('/profile')
                        }
         
                         else {

                            req.flash('error', "Wrong credentials")
                            return res.redirect('/')
                        }
                
                
            } else {
                req.flash('error', "Account not found")
                return res.redirect('/')
            }

        } catch (error) {

            return res.status(500).json({ error: error.message })
        }


    }

    exports.profile= async(req,res) => {
        const user = {
            text: 'SELECT * FROM users where id=$1',
            values: [req.session.userId]

        }

        const userInfo = await client.query(user)

        const users=await client.query("SELECT * FROM users")

        res.render('../views/profile',{ user: userInfo.rows,allusers:users.rows ,message: req.flash() });
    }
    exports.logout= async(req,res) => {
      
        req.session.destroy();
        return res.redirect('/')


    }

    exports.updateUser= async(req,res) => {
        try {

            const { name, email } = req.body

            if (!email || !name) {

                req.flash('error', "Email and Name are required")
                return res.redirect('/profile')
            }

           
            const update = {
                text: 'UPDATE users SET name=$1,email=$2 where id=$3',
                values: [name,email,req.session.userId]
    
            }
            const userUpdate = await client.query(update)
            req.flash('success', "Information updated")
            return res.redirect('/profile')

        }catch (error) {

            return res.status(500).json({ error: error.message })
        }


    }
