INSERT INTO public.rule_sets (file_size, created_at, id, coded_data, decoded_data, file_ext, file_name) VALUES
    (
        2150,
        '2025-09-19 18:07:29.294078',
        1,
        'VU5PIFJ1bGVzCgpHb2FsOgogIFRoZSBnb2FsIG9mIFVOTyBpcyB0byBiZSB0aGUgZmlyc3QgcGxheWVyIHRvIHJlYWNoIDAgcG9pbnRzLgogIFBsYXllcnMga2VlcCBwbGF5aW5nIGNhcmRzIGZyb20gdGhlaXIgaGFuZCB0byBtYXRjaCB0aGUgdG9wIGNhcmQgb24gdGhlIERpc2NhcmQgcGlsZSwgZWl0aGVyIGJ5IG51bWJlciBvciBjb2xvci4KClNldHVwOgogIC0gMSB0byA0IHBsYXllcnMgcGVyIGdhbWUuCiAgLSBVc2UgYSBzcGVjaWFsIFVOTyBkZWNrIG9mIDEwOCBjYXJkcy4KICAtIEVhY2ggcGxheWVyIGRyYXdzIDcgaGVyZCBjYXJkcy4KICAtIFBsYWNlIHRoZSByZW1haW5pbmcgZGVjayBhcyBhIERyYXcgUGlsZS4KClBsYXk6CiAgLSBQbGF5ZXJzIG11c3QgbWF0Y2ggY2FyZHMgYnkgY29sb3Igb3IgbnVtYmVyLgogIC0gSWYgYSBwbGF5ZXIgd2FubnQgdG8gcGxheSBhIGNhcmQgdGhhdCBkb2VzIG5vdCBtYXRjaCwgdGhleSBtdXN0IGRyYXcgZnJvbSB0aGUgZHJhdyBwaWxlLgogIC0gSWYgdGhlIGRyYXcgY2FyZCBhbHNvIGRvZXMgbm90IG1hdGNoLCB0aGVuIHRoZSBwbGF5ZXIgcGFzc2VzIHRoZWlyIHR1cm4uCgpTcGVjaWFsIENhcmRzOgogIC0gUmV2ZXJzZSAo+KCrKQogIC0gU2tpcCAoKysgY29sb3IpCiAgLSBEcmF3IFR3byAoKzIpCiAgLSBEcmF3IEZvdXIgKCsyKSBuZXh0IHBsYXllciBib3RoKQogIC0gV2lsZCBDYXJkIChjaGFuZ2UgdG8gY3VzdG9tIGNvbG9yKQogIC0gV2lsZCBDYXJkIOKAnFBsdXMgRm91ci7igJ0gKHBsYXllciBjYWxscyBvdXQgc3BlY2lmaWMgY29sb3IgYW5kIG51bWJlcikKClVOTyEgUnVsZToKICAtIFdoZW4gYSBwbGF5ZXIgaGFzIG9ubHkgb25lIGNhcmQgbGVmdCwgdGhleSBtdXN0IHNob3V0ICdVTk8hJyBiZWZvcmUgcGxheWluZyB0aGUgY2FyZC4KICAtIElmIHRoZXkgZmFpbCB0byBjYWxsICdVTk8hJyBhbmQgcGF5IGdvZXMgaW4gd2l0aG91dCBiZWluZyBjYXVnaHQsIHRoZXkgZHJhdyB0d28gY2FyZHMgYXMgYSBwZW5hbHR5LgogIC0gVGhlIGZpcnN0IHBsYXllciB0byByZWFjaCAwIHBvaW50cyBpcyB0aGUgd2lubmVyLgo=',
        e'UNO Rules\n\nGoal:\nThe goal of UNO is to be the first player to reach 0 points. Players keep playing cards from their hand to match the top card on the Discard pile, either by number or color.\n\nSetup:\n- 1 to 4 players per game.\n- Use a special UNO deck of 108 cards.\n- Each player draws 7 cards.\n- Place the remaining deck as a Draw Pile.\n\nPlay:\n- Players must match cards by color or number.\n- If a player cannot play a card, they must draw from the draw pile.\n- If the drawn card cannot be played, the turn passes.\n\nSpecial Cards:\n- Reverse (↺)\n- Skip (+1 turn skip)\n- Draw Two (+2)\n- Draw Four (+4) next player both\n- Wild Card (change to custom color)\n- Wild Draw Four (choose color and +4)\n\nUNO! Rule:\n- When a player has only one card left, they must shout UNO! before playing the card.\n- If they fail to call UNO! and play continues without being caught, they must draw two penalty cards.\n- The first player to reach 0 points is the winner.',
        'txt',
        'UNO Ruleset.txt'
    );
INSERT INTO public.game_sessions (is_active, created_at, id, rule_set_id, game_name, game_state, session_id) VALUES (true, '2025-09-19 18:07:29.340606', 1, 1, 'Uno', 'setup', 'session_70cd960c4a75425a9b8948908502b16b');
INSERT INTO public.game_players (created_at, id, session_id, player_name) VALUES ('2025-09-19 18:07:29.358845', 1, 1, 'Aki');
INSERT INTO public.game_players (created_at, id, session_id, player_name) VALUES ('2025-09-19 18:07:29.363687', 2, 1, 'Juan');

-- Name Chain Game
INSERT INTO public.rule_sets (file_size, created_at, id, coded_data, decoded_data, file_ext, file_name) VALUES
    (
        0,
        '2025-09-22 12:34:56.000000',
        2,
        'Example Only',
        e'# 🔤 Name Chain\n\n**Players:** 3 or more\n**Materials:** None\n\n---\n\n## Setup\n- Sit in a circle.\n- Choose a starting player.\n\n---\n\n## Rules\n1. Play goes clockwise.\n2. On your turn, say a word that starts with the **last letter of the name of the person to your left**.\n   - Example: If the person on your left is **Marta**, the last letter is **a**, so you could say **apple**.\n3. You must answer within **5 seconds**, or you''re out.\n\n---\n\n## Ending the Game\n- Play continues until only one player remains — that player wins!',
        'txt',
        'Name Chain Rules.txt'
    );

INSERT INTO public.game_sessions (is_active, created_at, id, rule_set_id, game_name, game_state, session_id) VALUES (true, '2025-09-22 12:34:56.000000', 2, 2, 'Name Chain', 'playing', 'session_name_chain_2025');

INSERT INTO public.game_players (created_at, id, session_id, player_name) VALUES ('2025-09-22 12:34:56.000000', 3, 2, 'Marta');
INSERT INTO public.game_players (created_at, id, session_id, player_name) VALUES ('2025-09-22 12:34:56.000000', 4, 2, 'Carlos');
INSERT INTO public.game_players (created_at, id, session_id, player_name) VALUES ('2025-09-22 12:34:56.000000', 5, 2, 'Sophie');

