use std::collections::HashMap;

fn main() {
    let mut buffer = String::new();
    std::io::stdin().read_line(&mut buffer).unwrap();
    let parts = buffer.split('&').collect::<Vec<_>>();
    let word = parts[0];
    let array = parts[1];

    let mut hash = HashMap::new();
    for char in array.chars() {
        if char.is_alphabetic() {
            hash.insert(char, hash.get(&char).unwrap_or(&0) + 1);
        }
    }

    for char in word.chars() {
        let mut zero = 0;
        let count = hash.get_mut(&char).unwrap_or(&mut zero);
        if *count > 0 {
            *count -= 1;
        } else {
            println!("false");
            return;
        }
    }

    println!("true");
}
