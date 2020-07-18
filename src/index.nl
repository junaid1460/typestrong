
contract NodeLike {
  
}


struct Node: contract NodeLike {
    value: string;
    type: string;

    function (node) GetValue () {
        const getNames = (value: Array<{value: number}>) =>  (
            | map e => e.value) 
            | filter e => e > 10
            | reduce 0, ( value, current => value + current )
        )
    }

    function (node) GetType () { // Mutates
        node.value = "hey 😋"
    }
}



const node: immutable Node =  {}


function name (value: string) {

}