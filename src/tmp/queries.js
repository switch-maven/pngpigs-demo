query getSingleAccoung ($id: String!) {
  account(id: $id) {
    name,
    assets {
      name
    }
  }
}

{
  accounts {
    id,
    name,
    assets {
      id,
      name
    }
  }
}
