from django.test import SimpleTestCase
from django.urls import reverse


class NewsPageTests(SimpleTestCase):
    def test_news_page_redirects_to_home_news_section(self):
        response = self.client.get(reverse("news"))

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse("partidos") + "#news")

    def test_world_cup_news_endpoint_returns_data_payload(self):
        response = self.client.get(reverse("world_cup_news"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("data", payload)
