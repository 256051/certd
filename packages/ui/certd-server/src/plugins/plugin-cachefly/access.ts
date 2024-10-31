import { AccessInput, BaseAccess, IsAccess } from '@certd/pipeline';

@IsAccess({
  name: 'CacheFly',
  title: 'CacheFly 授权',
  desc: 'CacheFly',
})
export class CacheflyAccess extends BaseAccess {
  @AccessInput({
    title: 'username',
    component: {
      placeholder: 'username',
    },
    required: true,
  })
  username = '';
  @AccessInput({
    title: 'password',
    component: {
      placeholder: 'password',
    },
    required: true,
    encrypt: true,
  })
  password = '';
  @AccessInput({
    title: 'totp key',
    component: {
      placeholder: 'totp key',
    },
    required: true,
    encrypt: true,
  })
  otpkey = '';
}

new CacheflyAccess();
