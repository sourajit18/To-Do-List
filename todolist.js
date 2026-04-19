const express = require("express");
const app = express();
app.use(express.json())

const fs = require("fs")
const path = require("path");
const filePath = path.join(__dirname, "Todo.json");
const { nanoid } = require("nanoid");

let todolist = []
try {
    const data = fs.readFileSync(filePath, "utf-8");
    todolist = JSON.parse(data);
} catch {
    todolist = []
}
app.get("/todos", ((req, res) => {
    const ToDoList = todolist.map((elem) => ({
        title: elem.title,
        description: elem.description
    }))
    res.json({
        ToDoList
    })
}))


function findItem(searchID) {
    let item = -1;
    for (let i = 0; i < todolist.length; i++) {
        if (todolist[i].id === searchID) { item = i; break; }
    }
    return item
}

app.get("/todos/:id", ((req, res) => {
    const searchID = req.params.id;
    const item=findItem(searchID)
    if (item == -1) {
        res.status(404).json({
            message: "Item Not Found"
        })
        return
    }
    res.json({
        title: todolist[item].title,
        description: todolist[item].description
    })
}))

app.post("/todos", ((req, res) => {
    const itemTitle = req.body.title;
    const itemDescription = req.body.description;
    const itemID = nanoid();
    todolist.push({
        title: `${itemTitle}`,
        description: `${itemDescription}`,
        id: itemID
    })
    res.status(201).json({
        message: "Item is Created",
        id: itemID
    })
fs.writeFileSync(filePath, JSON.stringify(todolist));
})
)

app.put("/todos/:id", ((req, res) => {
    const searchID = req.params.id;
    const updateTitle = req.body.title;
    const updateDescription = req.body.description;
    const item=findItem(searchID)
    if (item == -1) {
        res.status(404).json({
            message: "Item Not Found"
        })
        return
    }
    else {
        todolist[item].title = updateTitle
        todolist[item].description = updateDescription
        fs.writeFileSync(filePath, JSON.stringify(todolist));
        res.status(200).json({
            message: "Item was found and Updated"
        })
    }
})
)

app.delete("/todos/:id", ((req, res) => {
    const searchID = req.params.id
    const item=findItem(searchID)
    if (item == -1) {
        res.status(404).json({
            message: "Item Not Found"
        })
        return
    }
    else {
        todolist.splice(item,1)
        fs.writeFileSync(filePath, JSON.stringify(todolist));

        res.status(200).json({
            message: "Item was successfully deleted"
        })
    }
}))

app.listen(3000);