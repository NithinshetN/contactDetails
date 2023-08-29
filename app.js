const url = `https://cbook-server-app.onrender.com/api/contact`
const body = document.querySelector(".body");

let start=0;
let end=8   ;

const refresh=()=>{
    body.innerHTML=``;
}
let displayElement = [];
let dispLength;

// fetching api for displaying all the contacts
const fetching = async () => {
    try {
        const all = await fetch(`${url}/all`);
        const disp = await all.json();
        displayElement = disp;
         // Log inside the function after data is fetched
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetching().then(()=>{
    displaying(start,end);
});
const displaying=(start,end)=>{
    fetching();
    if(displayElement.length<=end){
        for(i=start;i<displayElement.length;i++){
            displayContact(displayElement[i]);
        }
    }else{
        for(i=start;i<end;i++){
            displayContact(displayElement[i]);
        }
    }
}





const next=document.querySelector(".next");
next.addEventListener("click",()=>{
    if(end>=displayElement.length){
        end=displayElement.length;
    }else{
        start=end;
        end+=8;
        refresh();
        displaying(start,end);
    }
    
})

const previous=document.querySelector(".previous");
previous.addEventListener("click",()=>{
    if(start===0){
        start=0;
    }else{
        end=start;
        start-=8;
        refresh();
        displaying(start,end);
    }
})


//displaying all the contacts

const displayContact = (data) => {
    let name = data.name;
    let id = data.id;
    let mno = data.mobile;
    let email = data.email;
    let tr = document.createElement("tr");
    let darkbox = document.querySelector(".deleteDark");
    let par = darkbox.querySelector("p");
    let ok = darkbox.querySelector(".ok")
    tr.innerHTML = `
    <tr>
    <td>${name}</td>
    <td>${mno}</td>
    <td>${email}</td>
    <td class="delete" style="display:flex;Justify-content:space-evenly;">
    <button class="edit btn btn-outline-primary"><i class="fa-solid fa-pen-to-square"></i></button>
    <button class="del btn btn-outline-danger"><i class="fa-solid fa-trash"></i></button>
    </td>
            </tr>
    `;

    //to call the edit modal
    const editButton = tr.querySelector(".edit");
    editButton.addEventListener("click", () => {
        edit(name, id, mno, email, tr);
    })

    //to call the delte modal and delte it
    const delButton = tr.querySelector(".del");
    delButton.addEventListener("click", () => {
        darkbox.style.display = "flex";
        par.innerHTML = `name:${name}</br> mno:${mno}`;
        ok.addEventListener("click", () => {
            delteInfo(id, tr);
            darkbox.style.display = "none";
        })
    });

    let cancel = darkbox.querySelector(".cancel")
    cancel.addEventListener("click", () => {
        darkbox.style.display = "none";
    })


    body.append(tr);

}




//Delete the contacts
const delteInfo = async (id, tr) => {
    try {
        const delResponse = await fetch(`${url}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
            }
        });
        tr.remove();
    } catch (error) {
        console.error('Delete Error:', error);
    }
}

//search the contacts
const text = document.querySelector(".input");
const search = async () => {
    tr = document.createElement("tr");
    const all = await fetch(`${url}/search?str=${text.value}`);
    const disp = await all.json();
    // if (disp.length === 0) {
    //     tr.innerHTML = `<tr><td colspan="4" style="text-align:center; font-weight:600">Result not found</td></tr>`;
    //     body.append(tr);
    // } else {
    //     disp.forEach(element => {
    //         displayContact(element);
    //     });
    // }
    return disp;
}



//eventListner for searching
text.addEventListener("input", () => {
    if (text.value===""){
        refresh();
        displaying(start,end);
    }
    else{
            search().then((disp)=>{
            refresh();
            if (disp.length === 0) {
            tr.innerHTML = `<tr><td colspan="4" style="text-align:center; font-weight:600">Result not found</td></tr>`;
            body.append(tr);
        } else {
            disp.forEach(element => {
                displayContact(element);
            });
        }
        }); 
    }
    console.log(text.value);
})


//
const input = document.querySelector(".input");

//fucntion for calling editing the contact
const box = document.querySelector(".box");
const edit = (name, id, mno, email) => {
    box.style.display = "flex";
    const dark = document.querySelector(".dark");
    const na = document.querySelector(".name");
    const mn = document.querySelector(".mno");
    const mail = document.querySelector(".email");
    na.value = name;
    mn.value = mno;
    mail.value = email;

    const btn = document.querySelector(".bts");
    btn.addEventListener("click", () => {
        editInfo(id, na.value, mn.value, mail.value).then(()=>{
            fetching().then(()=>{
                refresh();
                displaying(start,end);
            });
        });
        box.style.display = "none";
    })

    const back = document.querySelector(".backs");
    back.addEventListener("click", () => {
        box.style.display = "none";
    })
};

//function for editing the information by put method to api
const editInfo = async (id, name, mno, email) => {
    try {
        const delResponse = await fetch(`${url}?id=${id}&name=${name}&mobile=${mno}&email=${email}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            }
        });
    } catch (error) {
        console.error('Delete Error:', error);
    }
}

//function for adding new contact
const name2 = document.querySelector(".nameInput");
const email2 = document.querySelector(".emailInput");
const mno2 = document.querySelector(".numberInput");
const box1 = document.querySelector(".box1");

const putData = async () => {

    const put = await fetch(`${url}`, {
        method: 'POST',
        body: JSON.stringify({
            "name": `${name2.value}`,
            "mobile": `${mno2.value}`,
            "email": `${email2.value}`
        }),
        headers: {
            'Content-type': 'application/json',
        },
    });
    back();
    return put;

}

//functino to call eventlistner for adding the contact
const submit2 = document.querySelector(".submit2");

submit2.addEventListener("click", () => {
    putData().then(()=> {
        fetching().then(()=>{
            refresh();
            displaying(start,end);
        })
    }).catch(ele => {
        console.log(ele);
    })

})

//back function for 
function back() {
    box1.style.display = "none";
}
//function to display add elment
function clickable() {
    box1.style.display = "flex";
}

