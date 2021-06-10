const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const bodyParser = require("body-parser")
const swaggerJsdoc = require("./swagger.json")
const swaggerUi = require("swagger-ui-express")
const calculator = require('./calculator')
const { body, validationResult } = require('express-validator')

const cors = require('cors')

const fs = require('fs')
const path = require('path')
const pathToFile = path.resolve("./data.json")

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

const getResources = () => JSON.parse(fs.readFileSync(pathToFile))

app.use(express.json())


app.get("/", (req, res) => {
    res.json({
        message: 'Hello World'
    })
})

//tes doang
app.get("/api/test-slug/:slug", (req, res) => {
    const {slug} = req.params
    res.json({
        data: slug,
        message: 'success'
    })
})

app.get("/api/test-if/:slug", (req, res) => {
    const {slug} = req.params
    if (slug == '1') {
        return res.json({
            data: slug,
            message: 'success'
        })
    } else if (slug == '2') {
        return res.json({
            data: slug,
            message: 'success'
        })
    }

    res.status(400).json({
        errors: 'Gak nemu list nya woi!!'
    })
})

app.post(
    "/api/test-if/:slug",
    body('a').isInt().withMessage('Integer WOI'),
    body('b').isInt().withMessage('Integer WOI'),
    (req, res) => {

        const {slug} = req.params
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (slug == 'tambah') {
            let tot = calculator.tambah(req.body.a, req.body.b)
            return res.json({
                data: tot,
                message: 'success'
            })
        } else if (slug == 'kurang') {
            let tot = calculator.kurang(req.body.a, req.body.b)
            return res.json({
                data: tot,
                message: 'success'
            })
        } else if (slug == 'bagi') {
            let tot = calculator.bagi(req.body.a, req.body.b)
            return res.json({
                data: tot,
                message: 'success'
            })
        } else if (slug == 'kali') {
            let tot = calculator.kali(req.body.a, req.body.b)
            return res.json({
                data: tot,
                message: 'success'
            })
        }

        res.status(400).json({errors: "Gk ketemu listnya WOII"})
})

//PR nya bikin unit test nya
app.get("/api/resources", (req, res) => {
    const resources = getResources()
    res.send(resources)
})

//get id
app.get("/api/resources/:id", (req, res) => {
    const resources = getResources()
    const {id} = req.params
    const resource = resources.find((a) => a.id === id)
    res.send(resource)
})

app.get("/api/activeresources", (req, res) => {
    const resources = getResources()
    const activeResource = resources.find(resource => resource.status === "active")
    res.send(activeResource)
})

//post
app.post(
    "/api/resources",
    body('title').isString().withMessage('String WOI'),
    body('description').isString().withMessage('String WOI'),
    body('link').isString().withMessage('String WOI'),
    body('priority').isInt().withMessage('Int WOI'),
    body('timeToFinish').isInt().withMessage('Int WOI'),
    (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

    const resources = getResources()
    const resource = req.body

    resource.createdAt = new Date()
    resource.status = "inactive"
    resource.id = Date.now().toString()

    resources.push(resource)

    fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
        if (error) {
            return res.status(422).json({errors:"Cannot store data in the file"})
        }
    })
    res.send(resources)
})

app.patch("/api/resources/:id", (req, res) => {
    const resources = getResources()
    const {id} = req.params
    const index = resources.findIndex(resource => resource.id === id)
    const activeResource  = resources.find(resource => resource.status === "active")

    if (resources[index].status === "complete") {
        return res.status(422).json({errors: "Cannot update because resource has been completed"});
    }

    resources[index] = req.body

    if (req.body.status === "active") {
        if (activeResource) {
            return res.status(422).json({errors: "There is active resource already"})
        }

        resources[index].status = "active"
        resources[index].activationTime = new Date()
    }

    fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
        if (error) {
            return res.status(422).json({errors: "Cannot store data in the file"})
        }
    })

    res.json({errors: "Data has been updated"})

})

//delete
app.delete("/api/resources/:id", (req, res) => {
    const resources = getResources()
    const {id} = req.params
    const resource = resources.find((resource) => resource.id === id)
    if (resource) {
        resources.splice(resources.indexOf(resource), 1);
        fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
            if (error) {
                return res.status(422).json({errors:"Cannot store data in the file"})
            }
        })
        res.send(resources)
    } else {
        res.sendStatus(404)
    }

})

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsdoc)
);

app.listen(PORT, () => {
    console.log('server is listening on port: ' + PORT)
})

module.exports = app; // for testing
