package com.fd.fhtmid.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CommonUtils {
	/**
	 * 返回指定格式的城市map { value: '浙江', label: '浙江', children: [{ value: '杭州', label:
	 * '杭州', children: [{ value: '西湖', label: '西湖', }, ], }, ], },
	 * 
	 * @param list
	 * @return map
	 */
	public static List utilCity(List list) {
		List changedList = new ArrayList();
		for (int i = 0; i < list.size(); i++) {
			Map map = new HashMap();
			Map temp = (Map) list.get(i);
			// 所属级别 1 2 3 省市区县
			int level = (int) temp.get("level");
			if (level == 1) {
				map.put("value", temp.get("id"));
				map.put("label", temp.get("name"));
				list.remove(i);
				i--;
			}
			if (level == 2) {
				Map child = new HashMap();
				child.put("value", temp.get("id"));
				child.put("label", temp.get("name"));
				List children = new ArrayList();
				for (int j = 0; j < changedList.size(); j++) {
					Map sItem = (Map) changedList.get(j);
					if (sItem.get("value").equals(temp.get("pid"))) {
						int sign = 0;
						try {
							sign = ((List) sItem.get("children")).size();
							if (sign > 0) {
								children = (List) sItem.get("children");
							}
						} catch (Exception e) {

						}
						children.add(child);
						sItem.put("children", children);
						map = sItem;
						changedList.remove(j);
						break;
					} else {
						continue;
					}
				}
				list.remove(i);
				i--;
			}
			if (level == 3) {

				Map child = new HashMap();
				child.put("value", temp.get("id"));
				child.put("label", temp.get("name"));

				List children = new ArrayList();
				List clist = new ArrayList();

				// 循环第一级别
				for (int j = 0; j < changedList.size(); j++) {
					Map sItem = (Map) changedList.get(j);
					try {
						int m = 0;
						m = ((List) sItem.get("children")).size();
						// 判断第一级别是否有孩子
						if (m > 0) {
							clist = (List) sItem.get("children");
						}
						// 循环第二级别
						for (int k = 0; k < clist.size(); k++) {
							Map sItem2 = (Map) clist.get(k);
							if (sItem2.get("value").equals(temp.get("pid"))) {
								int sign = 0;
								try {
									sign = ((List) sItem2.get("children")).size();
									if (sign > 0) {
										children = (List) sItem2.get("children");
									}
								} catch (Exception e) {

								}
								children.add(child);
								sItem2.put("children", children);
								clist.remove(k);
								k--;
								clist.add(sItem2);
								sItem.put("children", clist);
								changedList.remove(j);
								j--;
								map = sItem;
								break;
							} else {
								continue;
							}
						}

					} catch (Exception e) {

					}

				}
			}
			changedList.add(map);
		}

		return changedList;
	}
	public static List genPCatalogTree(List list, String pid) {
		List retList = new ArrayList();
		for (int i = 0; i < list.size(); i++) {
			Map mapItem = (Map) list.get(i);
			Map treeItem = new HashMap();
			treeItem.put("title", mapItem.get("name"));
			treeItem.put("value", mapItem.get("catalog_no"));
			treeItem.put("key", mapItem.get("catalog_no"));
			if (Convert.toStr(pid, "").equals(Convert.toStr(mapItem.get("p_catalog_no"), ""))) {
				// 移除已经加入的节点
				list.remove(i);
				i--;
				// 递归调用
				List childList = genPCatalogTree(list, Convert.toStr(mapItem.get("catalog_no")));
				if (childList.size() > 0) {
					treeItem.put("children", childList);
				}
				retList.add(treeItem);
			}
		}
		return retList;
	}
	public static List genPCatalogLink(List list, String pid) {
		List retList = new ArrayList();
		for (int i = 0; i < list.size(); i++) {
			Map mapItem = (Map) list.get(i);
			Map treeItem = new HashMap();
			treeItem.put("label", mapItem.get("name"));
			treeItem.put("value", mapItem.get("catalog_no"));
			if (Convert.toStr(pid, "").equals(Convert.toStr(mapItem.get("p_catalog_no"), ""))) {
				// 移除已经加入的节点
				list.remove(i);
				i--;
				// 递归调用
				List childList = genPCatalogLink(list, Convert.toStr(mapItem.get("catalog_no")));
				if (childList.size() > 0) {
					treeItem.put("children", childList);
				}
				retList.add(treeItem);
			}
		}
		return retList;
	}

}
