# thunderbird-extension-carddav-books

An experiment extension implementing an API for managing connections to CardDAV address books

## Examples

### List Address Books
```
    let username = "user@domain.com";
    let password = "my_carddav_password";
    let books = messenger.carddav.list(username, password);
    for (const book of books) {
	console.log(book);
    }
```

