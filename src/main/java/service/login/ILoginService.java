package service.login;

import domain.login.UserContext;
import domain.login.UserLoginVO;
import domain.login.UserRegisterDomain;

public interface ILoginService {

	public UserContext login(UserLoginVO vo);

	public String register(UserRegisterDomain domain);
}
