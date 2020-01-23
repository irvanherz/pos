# README

POS adalah sebuah Application Programming Interfaces (APIs) backend berbasis MVC yang didesain secara terstruktur. Aplikasi ini dikembangkan untuk mejembatani integrasi antara aplikasi dan layanan manajemen penjualan toko.

## Cara Pemakaian
Sebelum memulai menggunakan POS, clone source code ke folder, lalu dilanjutkan dengan menginstall dependensi package yang diperlukan.
```sh
$ cd dir
$ git clone https://github.com/irvanherz/pos.git
$ yarn add express body-parser mysql multer dotenv jsonwebtoken cors morgan nodemon
```
POS menggunakan MySQL untuk dapat berjalan. Sehingga pastikan sebelum menjalankan aplikasi POS, MySQL sudah terinstal dan berjalan layanannya. Jangan lupa juga untuk mengubah konfigurasi database dari file `.env` yang bisa ditemukan di folder root.

Setelahnya POS dapat segera dijalankan dengan *yarn*.
```
$ yarn start
```
## Struktur Folder
Direktori :
  - `/src/routes/`: berisi kode untuk menangani routing berdasarkan url dan request.
  - `/src/controller/`: berisi kode controller yang menjadi jembatan antara request dan model.
  - `/src/model`: berisi kode untuk abstraksi akses database
  - `/src/middleware/`: berisi kode middleware, kebanyakan untuk filtering dan validasi.
  - `/src/helper/`: berisi kode helper untuk membantu jalannya aplikasi.

## Dokumentasi API
### Manajemen User
#### Sign up
Mendaftarkan user baru</br>
*URL* : `/auth/signup`</br>
*Method* : `POST`</br>
*Auth required* : NO</br>
*Permissions required* : None

**Success Response**
*Code* : `200 OK`

**Sample Request**
```json
{
    "name": "John Doe",
    "username": "john_doe",
    "password": "abcde12345",
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
Login dengan username dan password untuk memperoleh token JWT.</br>
*URL* : `/auth/sigin`</br>
*Method* : `POST`</br>
*Auth required* : NO</br>
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
Menambah sebuah produk ke dalam database</br>
*URL* : `/products/`</br>
*Method* : `POST`</br>
*Auth required* : YES</br>
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
Mengubah sebuah produk yang sudah ada di dalam database. Format input dan output sama seperti saat menambah produk.</br>
*URL* : `/products/:id`</br>
*Method* : `PUT`</br>
*Auth required* : YES</br>
*Permissions required* : YES

#### Hapus Produk
Menghapus sebuah produk dari database</br>
*URL* : `/products/:id`</br>
*Method* : `DELETE`</br>
*Auth required* : YES</br>
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
Mengambil data sebuah produk berdasarkan parameter ID nya.</br>
*URL* : `/products/:id`</br>
*Method* : `GET`</br>
*Auth required* : YES</br>
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
Mengambil data deretan produk dari urutan paling baru.</br>
*URL* : `/products/`</br>
*Method* : `GET`</br>
*Auth required* : YES</br>
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
Menambah kategori produk baru ke dalam database</br>
*URL* : `/categories/`</br>
*Method* : `POST`</br>
*Auth required* : YES</br>
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
Mengubah sebuah kategori yang sudah ada di dalam database. Format input dan output sama seperti saat menambah kategori.</br>
*URL* : `/categories/:id`</br>
*Method* : `PUT`</br>
*Auth required* : YES</br>
*Permissions required* : YES

#### Hapus Kategori
Menghapus sebuah kategori dari database</br>
*URL* : `/categories/:id`</br>
*Method* : `DELETE`</br>
*Auth required* : YES</br>
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
Mengambil data sebuah produk berdasarkan parameter ID nya.</br>
*URL* : `/categories/:id`</br>
*Method* : `GET`</br>
*Auth required* : YES</br>
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
Mengambil data deretan kategori dari dalam database.</br>
*URL* : `/categories/`</br>
*Method* : `GET`</br>
*Auth required* : YES</br>
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

### Manajemen Order
#### Tambah Order
Menambah produk-produk sebagai sebuah order baru.</br>
*URL* : `/orders/`</br>
*Method* : `POST`</br>
*Auth required* : YES</br>
*Permissions required* : YES

**Success Response**
*Code* : `200 OK`

**Sample Request**
```json
{
    "orderItems": [
        {
            "product_id": 1,
            "qty": 3
        },
        {
            "product_id": 3,
            "qty": "1"
        }
    ]
}
```

**Output**
```json
{
    "status": 200,
    "data": {
        "id": 1,
        "cashier_id": 2,
        "invoice_id": 7734562,
        "price": 44000,
        "orderItems": [
            {
                "id": 1,
                "order_id": 7734562,
                "product_id": 1,
                "qty": 3,
                "price": 30000,
                "product": {
                    "id": 1,
                    "name": "Nasi Bakar",
                    "description": "Cita rasa gurih menggoda tiada tara",
                    "category": "Drinks",
                    "image": null,
                    "price": 10000,
                    "created_at": "2020-01-22T17:49:12.000Z",
                    "updated_at": "2020-01-22T17:49:12.000Z"
                }
            },
            {
                ...
            }
        ]
    }
}
```

#### Hapus Order
Menghapus order dari database</br>
*URL* : `/orders/:id`</br>
*Method* : `DELETE`</br>
*Auth required* : YES</br>
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

#### Tampilkan Sebuah Order
Mengambil data sebuah produk berdasarkan parameter ID nya.</br>
*URL* : `/orders/:id`</br>
*Method* : `GET`</br>
*Auth required* : YES</br>
*Permissions required* : YES

**Success Response**
*Code* : `200 OK`

**Sample Output**
```json
{
    "status": 200,
    "data": {
        "id": 1,
        "cashier_id": 2,
        "invoice_id": 7734562,
        "created_at": "2020-01-22T18:32:32.000Z",
        "updated_at": "2020-01-22T18:32:32.000Z",
        "price": 44000,
        "orderItems": [
            {
                "id": 1,
                "order_id": 7734562,
                "product_id": 1,
                "qty": 3,
                "created_at": "2020-01-22T18:32:32.000Z",
                "updated_at": "2020-01-22T18:32:32.000Z",
                "price": 30000
            },
            {
                ...
            }
        ]
    }
}
```

#### Tampilkan Daftar Order
Mengambil data deretan order dari dalam database. Output hampir sama seperti saat menampilkan sebuah order saja. Namun, di sini kita akan memperoleh order dalam bentuk array.</br>
*URL* : `/orders/`</br>
*Method* : `GET`</br>
*Auth required* : YES</br>
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
