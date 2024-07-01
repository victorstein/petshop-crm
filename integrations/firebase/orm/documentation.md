## Adding a collection

Creating a new entity is as simple as defining a class and decorating it with all the validations needed ie.

```ts
export class Cat {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string
}
```

A couple of things to keep in mind:

- The class does not need any special decorator to be considered a collection
- The id of the class must be of type `DocumentReference`

> For more information on the available decorators for validation, feel free to check [class validator](https://github.com/typestack/class-validator)

## Adding a subcollection

Creating a subcollection for a document is as simple as adding the `@Subcollection` decorator to the property that will become a subcollection, for example.

```ts
export class Media {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(SupportedMimeTypes)
  mimeType: SupportedMimeTypes

  @IsUrl()
  url: string
}

export class Cat {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string

  @SubCollection('ProfilePicture')
  @Type(() => Media)
  @ValidateNested() // ensures that the validation will cover media decorators
  profilePicture: Media

  @SubCollection()
  @Type(() => Media)
  @ValidateNested({ each: true })
  @IsArray() // this enforces array validation
  gallery: Media[]
}
```

The `Subcollection` decorator can take an optional parameter that used to override the name of the subcollection when writing to the database.

Firebase supports any amount of documents for each subcollection; however, this can be limited using typescript this enforces type restrictions but will not work at DB level. meaning that the profile picture may contain x amounts of documents on its sub collection but the type will enforce only one.

## Adding relations to a main collection

Subcollections can be seen as children of a main collection, that can survive on their own even if the document they belong to removes all its data. However, there is also the concept of relational fields. These fields make a direct reference to a main collection, for example:

```ts
export class Cat {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty
  owner: DocumentReference
}
```

A couple of things to keep in mind:

- You can relate this to any other collection without restriction
- Enforcing relations to a specific data type is currently not supported

## Creating a repository from a collection

A repository may be created from a collection to facilitate the creation, deletion, modification, search of documents inside a collection. This can be done with the following function.

```ts
export class Cat {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string
}

const catRepository = getRepository(Cat)
```

A couple of things to keep in mind:

- You can create a repository from a subcollection but it will not work as a subcollection but a collection of its own, therefore, it is not recommended
- The repository will allow the creation of complex queries and expose the firebase functions needed for such queries. This will only work in the context of the collection itself
- The firebase object can be obtained from any repository this will allow raw operations using the firebase SDK

## Creating a document inside a collection using a repository

Taking into consideration the Cat collection, a cat may be created using the following code.

```ts
export class Cat {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string
}

const catRepository = getRepository(Cat)

const catDocument = await catRepository.create({
  name: 'buttons'
})
```

The code above, creates a new document that complies with the data validation specified by the decorators and the data structure defined by the class.

Now that we know how to create a simple document, let's dive into a more complicated example.

```ts
export class Media {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(SupportedMimeTypes)
  mimeType: SupportedMimeTypes

  @IsUrl()
  url: string
}

export class Cat {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string

  @SubCollection('ProfilePicture')
  @Type(() => Media)
  @ValidateNested()
  profilePicture: Media
}

const catRepository = getRepository(Cat)

// now creating a document with nested subcollections is as easy as:
const catDocument = await catRepository.create({
  name: 'buttons',
  profilePicture: {
    name: 'picture-1',
    mimeType: SupportedMimeTypes.JPEG,
    url: 'https://some.valid.com/picture-url.jpeg'
  }
})
```

The approach above reduces the complexity of validating and creating subcollections individually and then adding them to the main collection.

Finally, if the collection requires a document reference for its creation, its only a matter of adding the id (`FirestoreReference`) of the created collection to the new collection. For example:

```ts
export class User {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string
}

export class Cat {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty
  owner: DocumentReference
}

const catRepository = getRepository(Cat)
const userRepository = getRepository(User)

// First create the user object
const user = await userRepository.create({
  name: 'Joe'
})

// Then add the reference to the owner field
const catDocument = await catRepository.create({
  name: 'buttons',
  owner: user.id
})
```

## Finding a document inside a collection using the document id

This operation can be fulfilled by using the `findById` method exposed by the repository. This method has an optional parameter that allows you to fetch all the data form all the related subcollections.

Here is a simple example looking up by id without populating.

```ts
export class Cat {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string

  @SubCollection('ProfilePicture')
  @Type(() => Media)
  @ValidateNested()
  profilePicture: Media

  @SubCollection()
  @Type(() => Media)
  @ValidateNested({ each: true })
  @IsArray()
  gallery: Media[]
}

const foundCat = await catRepository.findById('cat-random-id')

console.log(foundCat)
// {
//  name: 'panfilo'
// }
```

A couple of things to keep in mind from the operation above:

- The id parameter can a `string` or a `DoucumentReference`
- The populate option is not mandatory and it is false by default

Here's an example of the usage of the populate option:

```ts
export class Cat {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string

  @SubCollection('ProfilePicture')
  @Type(() => Media)
  @ValidateNested()
  profilePicture: Media

  @SubCollection()
  @Type(() => Media)
  @ValidateNested({ each: true })
  @IsArray()
  gallery: Media[]
}

const foundCat = await catRepository.findById('cat-random-id', {
  populate: true
})

console.log(foundCat)
// {
//  name: 'panfilo',
//  profilePicture: {
//    name: 'file-name',
//    mimeType: 'jpeg',
//    url: 'http://some.valid.com/picture-url.jpeg'
//  },
//  gallery: [
//   {
//     name: 'file-name-2',
//     mimeType: 'jpeg',
//     url: 'http://some.valid.com/picture-url.jpeg'
//   },
//   {
//     name: 'file-name-3',
//     mimeType: 'jpeg',
//     url: 'http://some.valid.com/picture-url.jpeg'
//   }
// ]
// }
```

## Finding documents inside a collection

The repositories created by this library will expose a `find` method that allows complex query lookups using firebase integrated functions. Here is a quick example using the `where` clause.

```ts
// first, create the query
const query = catRepository.query(catRepository.where('owner', '==', user.id))

// then pass the query to the find method
const cats = await catRepository.find(query)
```

> This method should support all operations exported by the firebase SDK tho they are mostly untested.

In addition to the example above, there is an optional second parameter that will allow all the subcollections to be populated automatically.

```ts
// first, create the query
const query = catRepository.query(catRepository.where('owner', '==', user.id))

// then pass the query to the find method
const cats = await catRepository.find(query, { populate: true })
```

## Updating a document

The updating mechanism is currently the less polished method of the auto generated repositories. There is no type safety on the data that is passed along to change the document. This method is literally pass through of the original update mechanism of firebase SDK.

Here's an example of how to update a collection:

```ts
const ref = userRepository.doc(userPopulated.id.id)

await userRepository.update(ref, {
  name: 'joe'
})
```

> Notice that we are not passing the id from the model but the string id that is found inside the reference of the model that is why we use `userPopulated.id.id` instead of `userPopulated.id`.

Here's an example of how to update a subCollection:

```ts
const ref = userRepository.doc(
  userPopulated.id.id,
  'socialMediaProvider',
  userPopulated.socialMediaProvider[0].id.id
)

await userRepository.update(ref, {
  metadata: {
    test: 'test',
    test2: 'test2'
  }
})
```

> Notice that this time, we are passing in more parameters to the ref object. Keep in mind that the follow the pattern `id > collection > id > collection` until you reach the desired subcollection.

## Deleting a document

A document inside a collection can be deleted without removing all of the subcollection information. This is firebase `default` behavior; however, there is an additional option that can be passed to the delete method to cascade the deletion.

```ts
await catRepository.delete(foundCat.id, {
  // or a plain string id
  cascade: true
})
```

In the example above, we are deleting the specified Cat document and all its subcollections, however, it is possible to delete the Cat document without removing all child subcollections, this will leave the record on firestore but with all its properties removed.
