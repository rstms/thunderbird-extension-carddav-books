# thunderbird-extension-carddav-books

An experiment extension implementing an API for managing connections to CardDAV address books

## Examples

### List Address Books
```
    let books = messenger.carddav.list();
    for (const book of books) {
	console.log(book);
    }
```

