package service.sys.dmpar;

import java.util.List;
import java.util.Map;

import domain.common.KeyValueVO;

/**
 * @author zhangpengfei e-mail:pengfei19890227@163.com
 * @version 创建时间：2017年8月28日 下午11:36:10 类说明
 */
public interface IDmparService {

	public Map<String, List<KeyValueVO>> getAllDmpar();

	public List<KeyValueVO> getDmparByID(String id);
}
