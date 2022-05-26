from nutree.tree import Tree
import json


class WbNode:
    def __init__(self, title, *, type=None) -> None:
        self.title = title
        self.type = type

    def __repr__(self):
        return f"WbNode<'{self.title}'>"

    @staticmethod
    def serialize_mapper(node, data):
        data = {
            "title": node.data.title,
            "type": node.data.type,
        }
        return data


def make_tree(*, spec_list, parent=None, prefix=""):
    if parent is None:
        parent = Tree()

    spec_list = spec_list.copy()
    spec = spec_list.pop(0)
    for i in range(spec["count"]):
        i += 1  # 1-based
        p = f"{prefix}.{i}" if prefix else f"{i}"
        wb_node = WbNode(
            spec["title"].format(i=i, prefix=p),
            type=spec["type"],
        )
        node = parent.add(wb_node)
        if spec_list:
            make_tree(parent=node, spec_list=spec_list, prefix=p)
    return parent


if __name__ == "__main__":
    tree = make_tree(
        spec_list=[
            {"count": 10, "title": "Node {i}", "type": "folder"},
            {"count": 10, "title": "Node {prefix}", "type": "article"},
        ]
    )
    tree.print()
    child_list = tree.to_dict(mapper=WbNode.serialize_mapper)
    type_dict = {
        "folder": {"icon": "bi bi-folder", "classes": "classo"},
        "article": {"icon": "bi bi-book"},
    }
    column_list = [
        {"title": "Title", "id": "*", "width": "200px"},
        {
            "title": "Fav",
            "id": "favorite",
            "width": "30px",
            "classes": "wb-helper-center",
            "html": "<input type=checkbox tabindex='-1'>",
        },
        {
            "title": "Details",
            "id": "details",
            "width": "300px",
            "html": "<input type=text tabindex='-1'>",
        },
        {"title": "Mode", "id": "mode", "width": "100px"},
        {
            "title": "Date",
            "id": "date",
            "width": "100px",
            "html": "<input type=date tabindex='-1'>",
        },
    ]
    for i in range(50):
        i += 1
        column_list.append(
            {
                "title": f"#{i}",
                "id": f"state_{i}",
                "width": "30px",
                "classes": "wb-helper-center",
                "html": "<input type=checkbox tabindex='-1'>",
            }
        )
    wb_data = {
        "columns": column_list,
        "types": type_dict,
        "children": child_list,
    }

    with open("fixture.json", "wt") as fp:
        json.dump(wb_data, fp)
