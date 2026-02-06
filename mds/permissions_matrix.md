Permissions matrix (minimal roles)

Roles: anonymous, buyer, seller, admin

Anonymous
- view public listings (metadata + badge states)
- cannot view evidence or contact sellers

Buyer
- same as anonymous
- may request contact or express interest (creates lead)

Seller
- create/update/delete own listings
- upload evidence for own listings
- view own evidence

Admin
- view and download evidence for review
- change badge states, add audit log entries
- remove or flag listings

Enforcement: RBAC checks in `services/auth` and each service must validate actor role before performing sensitive actions.
