

contract NodeLike {
    value: string;
}


struct Node: contract NodeLike {
    value: string;
    type: string;

    function (node) GetValue () {

    }

    function (node) GetType () { // Mutates
        node.value = "hello"
    }
}



const node: immutable Node =  {}


function name (value: string) {

}