from unittest.mock import patch

from django.test import SimpleTestCase, override_settings


class NewsViewTests(SimpleTestCase):
    @override_settings(NEWSAPI_TOKEN="test-token")
    @patch("core.views.requests.get")
    def test_index_view_includes_news_items(self, mock_get):
        class FakeResponse:
            def __init__(self, payload):
                self._payload = payload

            def raise_for_status(self):
                return None

            def json(self):
                return self._payload

        mock_get.return_value = FakeResponse(
            {
                "articles": [
                    {
                        "title": "Mundial 2026 en foco",
                        "description": "La selección local sigue firme",
                        "url": "https://example.com/news/1",
                        "urlToImage": "https://example.com/image.jpg",
                        "source": {"name": "El País"},
                        "publishedAt": "2026-07-10T10:00:00Z",
                    }
                ]
            }
        )

        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Lo último del Mundial")
        self.assertEqual(len(response.context["news_items"]), 1)
        self.assertEqual(response.context["news_items"][0]["title"], "Mundial 2026 en foco")
