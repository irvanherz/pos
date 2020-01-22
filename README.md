# README

POS adalah sebuah Application Programming Interfaces (APIs) backend yang dikembangkan untuk menciptakan integrasi antara aplikasi dan layanan manajemen penjualan toko.

## Cara Pemakaian
Sebelum memulai menggunakan POS, clone source code ke folder, lalu dilanjutkan dengan menginstall dependensi package yang diperlukan.
```sh
$ cd dir
$ git clone https://github.com/irvanherz/pos.git
$ yarn add express body-parser mysql multer jsonwebtoken cors morgan nodemon
```
POS menggunakan MySQL untuk 
Setelahnya POS dapat segera dijalankan dengan *yarn*.
```
$ yarn start
```
## Struktur Folder
Direktori :
  - `/src/routes/`: berisi kode untuk menangani routing url.
  - `/src/controller/`: berisi kode controller
  - `/src/model`: berisi kode untuk model
  - `/src/middleware/`: berisi kode untuk 
  - `/src/helper/`:

## Dokumentasi API
### Manajemen User
#### Sign up
Mendaftarkan user baru
*URL* : `/auth/signup`
*Method* : `POST`
*Auth required* : NO
*Permissions required* : None

**Success Response**
*Code* : `200 OK`

**Sample Request**
```json
{
    "name": "John Doe",
    "username": "john_doe",
    "password": "abcde12345"
    "role": "0",
    "status": "0"
}
```

**Output**
```json
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "John Doe",
        "username": "john_doe",
        "role": "0",
        "status": "0"
    }
}
```
#### Sign in
Login dengan username dan password untuk memperoleh token JWT.
*URL* : `/auth/sigin`
*Method* : `POST`
*Auth required* : NO
*Permissions required* : None

**Success Response**
*Code* : `200 OK`

**Sample Request**
```json
{
    "username": "john_doe",
    "password": "abcde12345"
}
```

**Output**
```json
{
    "status": 200,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvaG4gRG9lIiwidXNlcm5hbWUiOiJqb2huX2RvZSIsInJvbGUiOjAsImlhdCI6MTU3OTcxNTAyNCwiZXhwIjoxNTgwMzE5ODI0fQ.LNXpETn_1zDV_UaaMzS63N43M6OWRM0BqKycYq86Z_Q"
    }
}
```

### Manajemen Produk
#### Tambah Produk
Menambah sebuah produk ke dalam database
*URL* : `/products/`
*Method* : `POST`
*Auth required* : YES
*Permissions required* : YES

**Success Response**
*Code* : `200 OK`

**Sample Request**
```json
{
    "name": "Nasi Bakar",
    "description": "Cita rasa gurih menggoda tiada tara",
    "category_id": "1",
    "price": "10000"
}
```

**Output**
```json
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "Nasi Bakar",
        "description": "Cita rasa gurih menggoda tiada tara",
        "category_id": "1",
        "price": "10000"
    }
}
```

#### Ubah Produk
Mengubah sebuah produk yang sudah ada di dalam database. Format input dan output sama seperti saat menambah produk.
*URL* : `/products/:id`
*Method* : `PUT`
*Auth required* : YES
*Permissions required* : YES

#### Hapus Produk
Menghapus sebuah produk dari database
*URL* : `/products/:id`
*Method* : `DELETE`
*Auth required* : YES
*Permissions required* : YES

**Success Response**
*Code* : `200 OK`

**Sample Output**
```json
{
    "status": 200,
    "data": {
        "id": "2",
        "message": "Delete OK"
    }
}
```

#### Tampilkan Sebuah Produk
Mengambil data sebuah produk berdasarkan parameter ID nya.
*URL* : `/products/:id`
*Method* : `GET`
*Auth required* : YES
*Permissions required* : YES

**Success Response**
*Code* : `200 OK`

**Sample Output**
```json
{
    "status": 200,
    "data": {
        "id": 3,
        "name": "Nasi Goreng",
        "description": "Dibuat dengan sepenuh cinta demi rasa enak tak terlupakan",
        "category": null,
        "image": null,
        "price": 10000,
        "created_at": "2020-01-22T18:03:28.000Z",
        "updated_at": "2020-01-22T18:03:28.000Z"
    }
}
```

#### Tampilkan Daftar Produk
Mengambil data deretan produk dari urutan paling baru.
*URL* : `/products/`
*Method* : `GET`
*Auth required* : YES
*Permissions required* : YES

**Success Response**
*Code* : `200 OK`

**Sample Output**
```json
{
    "status": 200,
    "data": [
        {
            "id": 3,
            "name": "Nasi Goreng",
            "description": "Dibuat dengan sepenuh cinta demi rasa enak tak terlupakan",
            "category": null,
            "image": null,
            "price": 10000,
            "created_at": "2020-01-22T18:03:28.000Z",
            "updated_at": "2020-01-22T18:03:28.000Z"
        },
        {
            ...
        }
    ]
}
```

### Manajemen Kategori
#### Tambah Kategori
Menambah kategori produk baru ke dalam database
*URL* : `/categories/`
*Method* : `POST`
*Auth required* : YES
*Permissions required* : YES

**Success Response**
*Code* : `200 OK`

**Sample Request**
```json
{
    "name": "Drinks"
}
```

**Output**
```json
{
    "status": 200,
    "data": {
        "id": 1,
        "name": "Drinks"
    }
}
```

#### Ubah Kategori
Mengubah sebuah kategori yang sudah ada di dalam database. Format input dan output sama seperti saat menambah kategori.
*URL* : `/categories/:id`
*Method* : `PUT`
*Auth required* : YES
*Permissions required* : YES

#### Hapus Kategori
Menghapus sebuah kategori dari database
*URL* : `/categories/:id`
*Method* : `DELETE`
*Auth required* : YES
*Permissions required* : YES

**Success Response**
*Code* : `200 OK`

**Sample Output**
```json
{
    "status": 200,
    "data": {
        "id": "2",
        "message": "Delete OK"
    }
}
```

#### Tampilkan Sebuah Kategori
Mengambil data sebuah produk berdasarkan parameter ID nya.
*URL* : `/categories/:id`
*Method* : `GET`
*Auth required* : YES
*Permissions required* : YES

**Success Response**
*Code* : `200 OK`

**Sample Output**
```json
{
    "status": 200,
    "data": {
        "id": 2,
        "name": "Foods",
        "created_at": "2020-01-22T18:15:03.000Z",
        "updated_at": "2020-01-22T18:15:03.000Z"
    }
}
```

#### Tampilkan Daftar Kategori
Mengambil data deretan kategori dari dalam database.
*URL* : `/categories/`
*Method* : `GET`
*Auth required* : YES
*Permissions required* : YES

**Success Response**
*Code* : `200 OK`

**Sample Output**
```json
{
    "status": 200,
    "data": [
        {
            "id": 1,
            "name": "Drinks",
            "created_at": "2020-01-22T18:12:07.000Z",
            "updated_at": "2020-01-22T18:12:07.000Z"
        },
        {
            ...
        }
    ]
}
```

