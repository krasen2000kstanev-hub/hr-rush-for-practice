import importlib.util
from pathlib import Path
import sys
import types
import unittest

fake_boto3 = types.SimpleNamespace(resource=lambda *_: types.SimpleNamespace(Table=lambda *_: None))
sys.modules.setdefault("boto3", fake_boto3)
conditions = types.ModuleType("boto3.dynamodb.conditions")
conditions.Key = lambda value: value
sys.modules.setdefault("boto3.dynamodb", types.ModuleType("boto3.dynamodb"))
sys.modules.setdefault("boto3.dynamodb.conditions", conditions)

spec = importlib.util.spec_from_file_location(
    "app", Path(__file__).resolve().parents[1] / "backend" / "app.py"
)
app = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app)


class AppTests(unittest.TestCase):
    def test_valid_ids(self):
        self.assertEqual(app.clean_id("mission_1"), "mission_1")

    def test_invalid_ids(self):
        with self.assertRaises(app.ApiError):
            app.clean_id("../users")

    def test_roles(self):
        event = {"requestContext": {"authorizer": {"jwt": {"claims": {"cognito:groups": "reviewer,admin"}}}}}
        self.assertEqual(app.roles(event), {"reviewer", "admin"})


if __name__ == "__main__":
    unittest.main()
