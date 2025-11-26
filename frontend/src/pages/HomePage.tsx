import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { booksAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import RecommendedBooksCarousel from '../components/RecommendedBooksCarousel';
import type { Book } from '../types';

// Banner Images
const bannerImages = [
  { src: "https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSmQfUYNUqu0hkzsWoMU4-s1c-VSbuYW55wTXu_C1BPSou2mEEj-tSYGH9cshGiuqOmMUHStetNtNXkO3W_URz3cqL81kliLlg0RIdblqlJKI1vcRwKz4bo-GRMmWO0WPgvs6Lulj5l98ZsZ4t8VvJZQHGNewnr-2ohKHTWZJNFb8iwuskUcZ0X4P_Pg_RS6NzhfpuXDYfAxgWaBlk4rq8BK2AhLG5je88pgJzo07QxOi9PD82qLQVBED0MS5YqB4Vt7mdDzOBCFXgit1u6pECEIxIHDz8Dm3CNL2E2d-LT-nSbjcSatXR31NyxKZg7hTbt5BN-tKoqR_QL8xy9HX3QkCcXu3rjTai_ED5h_zDQ39RFvlBpOU5qqwfwKczqn2hduGZ3qSX_W58DLH6i09rHrZWghUvwrcZlc8SNsU6shs5nn9SkICD-s38R_Fkh6zTS-CM1DLsc3fDY9Ax6dSiM5Q605856rroI0HO-Ob9cvbIW2448n_CUfTKGrRslk0OkHGIFBY21YWMHuArU3r9vqR6ueuvIA0VYoZ8sakuxxz0dCRzMJvILRY0dKhc5wBGgoF2wpxQ6oe_xrg1QJmjD8aQccWJT52JEjMst29JK0cP1fO3Mv5Ec1Ybb1iwQXjJStSxUFS2_OU8Ou73GlGZ5xu3ALWOtSmmPtpQW5n5PepDP_S5oDsZzQEx14o_Xaqsap3itmMF3PjA6AI-OHSQB8nX6QxbRhLoaDQAmqYgwjks1JcRPXourAEVGZcal6NkxKaml_PH89JaUvHdYvPKA0V5bv9LdrZiZrK8IpY_Tb4K0kO-rCKIcBpeDkm66pFssxjqZ5iUG6ydHSZqZlfJCeCjA26aQJwxMthCGUzZPgOtsKfBwmjo0rqkFPQcBUeRETePxJJq7hNonpUhVautdmWoqBTaZCe7FxxeNsoZTAkFKQfcV3fgik_v9gYgFYcBb3g9vTWbuIA5cFQwmuPayp7UeX84PmvyecugxwssKspDOn-SA69a7ml_oVdRGiCdihpxgQhmohLfQ9Kx38uAWIafT4ObqZ4csKv_L7yKqn40RrhtnM4ctBf_5TqD7N8QxMu1ADht01O6xRWXm2M0BTwlhkoTSn2pyHGOZ2eNkF8mbb_20_7_4zF_tgAY_ILeHKILuBqOJykuRLC3u7XIouOu2u0wktOCnhOX8xs2vkOgs5nFPrwMOnO4YKYA9C9pAjYxMkl-Va2cZSgXQ=s1024-rj", alt: "Banner 1" },
  { src: "https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSlfETkXKm8jEgTZH2kJAjI6e7USek5ws9t-YnilSsshE8HG43SENw4PGW-QSCIdJZXJgd0Hv_tDkJSlWg15KWUK_RSQgnSQ-PZQjbUgDv-pfkfM_7O83kC911CGygm5I5pURcD8BE0qRTBh-n9Tl1FcqZBwSOviaVtrPGOegXeQAyITLE7GeiQazQtQwa-A5mROLC3p-faHzei_kT2fwUoEcOYYFEav5s2H14BLl0XER5nQommblRjqN-MSrGzNx1fPMEPalhMi03mutycmz9k_kRWojMHx_QX3NpybKkTPzA4AjfMXb1ns7IP1wygeONVQYnPM_InpxSiVGJ6g5i4_F7wGMiu2IqhGhnvQIVcgJg-UQw2vacwc7ccnRCLCu5a3Bnmqp6jDzUmtzejir8NSUBfIR3Pnz9lNWMlAXfP1khwKVUUTfEEa-UL4ig3JxnTsPZ_0-JguBRevEL82gTVix4FUVdwNlk_Wd8VSgzTq8H_E7mtNBzl83oPOLnVKOQ43HDqJGPRemhHJBwOjmn9RiHAPKQYm9LRodRixVVuGpuEvT0QdGDyeLEPIPQk_vuHiKRU8rYl7vUnLoj5Kx0B25IGS3VhjZ33AFC2A5PNCT5wHNv32WjKWb-ABlrt3EkiW_BDImPayKt4M49DHGGhmSEUfZEPM1YymJjCMHlG7UIWWeOYdlLuv2oY0X58PPfAeIkMtr4m7WJTN7ddq4jJHfJPsVmlizeqRnMsfYU8ago_iNGqitNLXAPsJuzWGJ7eRD513U9VwO5V3GUdCBzNUzRxD4In341UvrGfeBd3akwcVTkG0luSfIOTkk310nNEtMgZiuRfxocoR-xdjniQ4ZIf5ERb2hTiwQn3VdU5_wdYUEZzcMCKisXnprhU0Cjr9zxK7rxS6_zQvUO-d1pE0iw0tOHrVRFdhqHxQI6kiRvtSVRVpFJdG9huEacUSuAvQQQeTJdej1Mjt7Hz6XUVl-nc6FUM_VhftgzVf2e0A6BEWRQ7vlKhvraALX1pdJeGIcSmxqJNgeqEhwdtO2VBptL7J69RWNaI5fIaWtsUbG4iNZOK6Iz2V9EGSi1bUHcwZzmlYYPDnD59IH5i6wk3bB4s0FWAp4jjcEm8PQuQdDSx_ED8-UiLNQu3piEFzkT4Ww7W_VmVD8e05w5gPoSLExTvmGEB0MafmsKD0P0s0fkoRpre3Rs2wR2oF81F_ujqsn3K-iAMMkxc24Q=s1024-rj", alt: "Banner 2" },
  { src: "https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSlohi0fF3KFOAu_JRdIR61wnlh4uPL-AN6kNJrKDJY4UlFVIYA9zlOKhDMAp-SQ8x_hTGCA7t7tYKUa0B9mhHd0yIRUrU47O0VlN23UdmXcFaII7pRkdl8WMS96fhc2lG9FKiIDJ8qUktd7AscrYVfmQxZULcp69d5tyz5AZAUNHvy0Se5jzPRXYIGfZikf_oVeVSNxvC7Jaz6-Lwx0NXdlnj3b7tCouvemll8bxdx_swIEZ1XZJuoLn706eA0Zk_EePXD7Tv_mZu9vCTGBYSJIEeSo6AxHn5XjNlwWomqnjVb_4Kgm0PwI2vh6piGn6mNOJk-mQ5GIBKBB6WRnjH4wUkDAWVSBvAyEvCr6R2n2Y3FZ7nF64YfrXBdFow_qR7lsWUcVPagcw6bLuAlaTsN1wOX97QJ8YBHK4sNKnyUn7r-rJ3HJ2B8liWbTAz8yLBZur9wLoC6S3RtvqxXmsF6MvCJ6mKNpaBjYKGmm3Ral-Y4lViiEub3WMX2IYUlPeh3U65dtener0B3p-bVWQN3J09Q66syLOgeO-yFR6umupXL7KoR5J3Jx1GCAvzsdXE0fyDn1My44y34VbVPDTlelFRUiCGz9KQwGJmXXGDsCEKr7dh6fNsS8uMrg_3HrDOWfLoECQoUfVsjpPovZ7GBviwB1UEKJZj5FBdsVrh9wXUBQZNbcN8D4_6W4g1bMzkD42wzGY0BN7p2IcpMpZe_oP0HvpJSeGxSMgcrD-xA2bXXZXf86wbf_ptvXVNhobkAhY0l5MUYShPiBGUQ9HbwYVDfy1ppsoHZH_V4oianYbNbljyZAfKQM74LOTNK_KQBAyM9iik1Mc94pD9baSJ7WxUuransN9w6s3YoG5l93OVjaGcIWszDUR8yxIcq1eP21xQe8onhEnoIirGiUNxLgkFZOmuCYfGCkUbwKpeY7iTooQiywJwn-33AcubQuXUHWC9YRwSLeB4bzilK_icpu8x6SduK2w8C86feFab327AGCXDZpv4iAwyVhe1_aPdUVybalVEx5vSghIEHlWPaVW_JH7DRoxESMxI9F0GtojtEaplMqEm3LZ78L2ePmXUT4y7eDYaA_IXNWvljtlruDzPYNDNa2BJgZqBjIpNv1ACG356PuhQE5gyxc3_5on_fegjXcuiec-5i2kwh4nQ3wAtjrcg-qHkkITEDr3EzgR2NOKuFLu6DRLG7yuE_Jh-Q40v3lT-4FyXVjC7g=s1024-rj", alt: "Banner 3" },
];

const topPromotions = [
  { id: 1, src: "https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSmQfUYNUqu0hkzsWoMU4-s1c-VSbuYW55wTXu_C1BPSou2mEEj-tSYGH9cshGiuqOmMUHStetNtNXkO3W_URz3cqL81kliLlg0RIdblqlJKI1vcRwKz4bo-GRMmWO0WPgvs6Lulj5l98ZsZ4t8VvJZQHGNewnr-2ohKHTWZJNFb8iwuskUcZ0X4P_Pg_RS6NzhfpuXDYfAxgWaBlk4rq8BK2AhLG5je88pgJzo07QxOi9PD82qLQVBED0MS5YqB4Vt7mdDzOBCFXgit1u6pECEIxIHDz8Dm3CNL2E2d-LT-nSbjcSatXR31NyxKZg7hTbt5BN-tKoqR_QL8xy9HX3QkCcXu3rjTai_ED5h_zDQ39RFvlBpOU5qqwfwKczqn2hduGZ3qSX_W58DLH6i09rHrZWghUvwrcZlc8SNsU6shs5nn9SkICD-s38R_Fkh6zTS-CM1DLsc3fDY9Ax6dSiM5Q605856rroI0HO-Ob9cvbIW2448n_CUfTKGrRslk0OkHGIFBY21YWMHuArU3r9vqR6ueuvIA0VYoZ8sakuxxz0dCRzMJvILRY0dKhc5wBGgoF2wpxQ6oe_xrg1QJmjD8aQccWJT52JEjMst29JK0cP1fO3Mv5Ec1Ybb1iwQXjJStSxUFS2_OU8Ou73GlGZ5xu3ALWOtSmmPtpQW5n5PepDP_S5oDsZzQEx14o_Xaqsap3itmMF3PjA6AI-OHSQB8nX6QxbRhLoaDQAmqYgwjks1JcRPXourAEVGZcal6NkxKaml_PH89JaUvHdYvPKA0V5bv9LdrZiZrK8IpY_Tb4K0kO-rCKIcBpeDkm66pFssxjqZ5iUG6ydHSZqZlfJCeCjA26aQJwxMthCGUzZPgOtsKfBwmjo0rqkFPQcBUeRETePxJJq7hNonpUhVautdmWoqBTaZCe7FxxeNsoZTAkFKQfcV3fgik_v9gYgFYcBb3g9vTWbuIA5cFQwmuPayp7UeX84PmvyecugxwssKspDOn-SA69a7ml_oVdRGiCdihpxgQhmohLfQ9Kx38uAWIafT4ObqZ4csKv_L7yKqn40RrhtnM4ctBf_5TqD7N8QxMu1ADht01O6xRWXm2M0BTwlhkoTSn2pyHGOZ2eNkF8mbb_20_7_4zF_tgAY_ILeHKILuBqOJykuRLC3u7XIouOu2u0wktOCnhOX8xs2vkOgs5nFPrwMOnO4YKYA9C9pAjYxMkl-Va2cZSgXQ=s1024-rj", alt: "รวมโปรโมชั่น" },
  { id: 2, src: "https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSlfETkXKm8jEgTZH2kJAjI6e7USek5ws9t-YnilSsshE8HG43SENw4PGW-QSCIdJZXJgd0Hv_tDkJSlWg15KWUK_RSQgnSQ-PZQjbUgDv-pfkfM_7O83kC911CGygm5I5pURcD8BE0qRTBh-n9Tl1FcqZBwSOviaVtrPGOegXeQAyITLE7GeiQazQtQwa-A5mROLC3p-faHzei_kT2fwUoEcOYYFEav5s2H14BLl0XER5nQommblRjqN-MSrGzNx1fPMEPalhMi03mutycmz9k_kRWojMHx_QX3NpybKkTPzA4AjfMXb1ns7IP1wygeONVQYnPM_InpxSiVGJ6g5i4_F7wGMiu2IqhGhnvQIVcgJg-UQw2vacwc7ccnRCLCu5a3Bnmqp6jDzUmtzejir8NSUBfIR3Pnz9lNWMlAXfP1khwKVUUTfEEa-UL4ig3JxnTsPZ_0-JguBRevEL82gTVix4FUVdwNlk_Wd8VSgzTq8H_E7mtNBzl83oPOLnVKOQ43HDqJGPRemhHJBwOjmn9RiHAPKQYm9LRodRixVVuGpuEvT0QdGDyeLEPIPQk_vuHiKRU8rYl7vUnLoj5Kx0B25IGS3VhjZ33AFC2A5PNCT5wHNv32WjKWb-ABlrt3EkiW_BDImPayKt4M49DHGGhmSEUfZEPM1YymJjCMHlG7UIWWeOYdlLuv2oY0X58PPfAeIkMtr4m7WJTN7ddq4jJHfJPsVmlizeqRnMsfYU8ago_iNGqitNLXAPsJuzWGJ7eRD513U9VwO5V3GUdCBzNUzRxD4In341UvrGfeBd3akwcVTkG0luSfIOTkk310nNEtMgZiuRfxocoR-xdjniQ4ZIf5ERb2hTiwQn3VdU5_wdYUEZzcMCKisXnprhU0Cjr9zxK7rxS6_zQvUO-d1pE0iw0tOHrVRFdhqHxQI6kiRvtSVRVpFJdG9huEacUSuAvQQQeTJdej1Mjt7Hz6XUVl-nc6FUM_VhftgzVf2e0A6BEWRQ7vlKhvraALX1pdJeGIcSmxqJNgeqEhwdtO2VBptL7J69RWNaI5fIaWtsUbG4iNZOK6Iz2V9EGSi1bUHcwZzmlYYPDnD59IH5i6wk3bB4s0FWAp4jjcEm8PQuQdDSx_ED8-UiLNQu3piEFzkT4Ww7W_VmVD8e05w5gPoSLExTvmGEB0MafmsKD0P0s0fkoRpre3Rs2wR2oF81F_ujqsn3K-iAMMkxc24Q=s1024-rj", alt: "หนาวนี้อ่านเพลิน" },
  { id: 3, src: "https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSlohi0fF3KFOAu_JRdIR61wnlh4uPL-AN6kNJrKDJY4UlFVIYA9zlOKhDMAp-SQ8x_hTGCA7t7tYKUa0B9mhHd0yIRUrU47O0VlN23UdmXcFaII7pRkdl8WMS96fhc2lG9FKiIDJ8qUktd7AscrYVfmQxZULcp69d5tyz5AZAUNHvy0Se5jzPRXYIGfZikf_oVeVSNxvC7Jaz6-Lwx0NXdlnj3b7tCouvemll8bxdx_swIEZ1XZJuoLn706eA0Zk_EePXD7Tv_mZu9vCTGBYSJIEeSo6AxHn5XjNlwWomqnjVb_4Kgm0PwI2vh6piGn6mNOJk-mQ5GIBKBB6WRnjH4wUkDAWVSBvAyEvCr6R2n2Y3FZ7nF64YfrXBdFow_qR7lsWUcVPagcw6bLuAlaTsN1wOX97QJ8YBHK4sNKnyUn7r-rJ3HJ2B8liWbTAz8yLBZur9wLoC6S3RtvqxXmsF6MvCJ6mKNpaBjYKGmm3Ral-Y4lViiEub3WMX2IYUlPeh3U65dtener0B3p-bVWQN3J09Q66syLOgeO-yFR6umupXL7KoR5J3Jx1GCAvzsdXE0fyDn1My44y34VbVPDTlelFRUiCGz9KQwGJmXXGDsCEKr7dh6fNsS8uMrg_3HrDOWfLoECQoUfVsjpPovZ7GBviwB1UEKJZj5FBdsVrh9wXUBQZNbcN8D4_6W4g1bMzkD42wzGY0BN7p2IcpMpZe_oP0HvpJSeGxSMgcrD-xA2bXXZXf86wbf_ptvXVNhobkAhY0l5MUYShPiBGUQ9HbwYVDfy1ppsoHZH_V4oianYbNbljyZAfKQM74LOTNK_KQBAyM9iik1Mc94pD9baSJ7WxUuransN9w6s3YoG5l93OVjaGcIWszDUR8yxIcq1eP21xQe8onhEnoIirGiUNxLgkFZOmuCYfGCkUbwKpeY7iTooQiywJwn-33AcubQuXUHWC9YRwSLeB4bzilK_icpu8x6SduK2w8C86feFab327AGCXDZpv4iAwyVhe1_aPdUVybalVEx5vSghIEHlWPaVW_JH7DRoxESMxI9F0GtojtEaplMqEm3LZ78L2ePmXUT4y7eDYaA_IXNWvljtlruDzPYNDNa2BJgZqBjIpNv1ACG356PuhQE5gyxc3_5on_fegjXcuiec-5i2kwh4nQ3wAtjrcg-qHkkITEDr3EzgR2NOKuFLu6DRLG7yuE_Jh-Q40v3lT-4FyXVjC7g=s1024-rj", alt: "ดีลเด็ด E-Book" },
  { id: 4, src: "https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSla7WGO5N-zj1zn1ya1CgMvdu5hU0m2npAnT8R9bdPBqED3wK9KIPSA18DXrrlheEunW0K4hnHQWSrhbkXQ46zjQrP_xhuKkaUPFFKa14NzxS2cAwsURvl1TtR5YT1w66YXkX_gGt1bk2O0ioWRL9zP21D7JeCwxJ2TqR-Xve7r5sAXTpR0xTn7kCeSOogEWGE6an-R6XDDoP8geun8KnYSoY3DSBJ03DFFyByLP0EAI1SktktcdvMtC4qRvBY-O-GyCATS04lRMcFPthwN5DK-IXtSh5ab_-IyyYvb9_aNUIvubyQPf1vaT_9BvvJ64P1XBeNZCAuhu06E2lDfXhDubS-E4txnc91AZXRGRNPzO0-7FGgqAIK2bnhcn146GVL2aQdi_nktoMk2oeB3y6HWavJWIi933ack12hwrcMcbdnI_AeIPXkH9k6xLkw9ajGDpz0rH7xmYXKsQ6xOCqCYi4xjfL4in0pv-_r1tzziwZQFptYPa3KCIKurJT0BDfJKlveSsI0Q2AhQPSRMIP7iaBt8gpIxhzW6J8UFBESmDjUylVWXZeIUg_SbNxysDcPw3gzco4TiPhrsm9oWm4UQugadyWJgkCVDPZ7m1_Wg-j0HCNJoH-9axroHZFhH7SvEEEzrj1LCIhSFe79d2BUnAfCSJX6ruVHm0fa6fqzdvQjZzREkIIzI0vXvi89wOoQ3_ZsCIsVcgHYtBjX5uPi2EJ2uQuMBSnkDNFowPo3ruyvKeMuSQhLok2KDjAmxGv-MUINWBQYAIhdqWt38HmDIqj0zJVxmWcxMBSlZFOUNReqdbk6TPozvFKeyMO-wrQE2eDivJ3wlwkzuadtt8JrcVnp6VpEq8Vu0UM8ghjhpqUFD3ulJ-F4oVa6TeKaCD27pTRa_xsuMw1cnJkHZMxJdw7MhGdKiIMw1rWJ8YrD0LaDI5O10S9pCbBcECz_nSoMjkrAMu8uiltV1xV4ATdlklhT0-PaZ_SGvj-TkoastjTHx_eS00DeoeBzJIu0FIiUyP2dMnGsDWY50w0HX5aQbdLt7SgMZycH16-ZFvrA_Uwe6LIJyJnXYaZwBfWFm57fbI0Dd-c5cudLci21sOqo759S9OYlAxnO4SXT8a4-5Naic_Qi0Pk0WZlS6ak7b7RG1ZqvNcr98dApoF5RumfuEoWG0EfvtT5_ElHTdXUAlcPqg654mkN6ADTzxIfl3kVdIbqgSknvwib8zR8M=s1024-rj", alt: "Mid Month Sale" },
  { id: 5, src: "https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSnGnqpq0Zex51ChUE9WaAHX94s4Lzu_4lV776ie9gSM0wm8T06yJ_B8r8pmwLbtm-qgSdUqo9jCzw1kPYAkyGzOJ-An_6UmJkYzwF2ZunADOMy7bLNQl08-SGGcFXR_DY-EfaTJufoUqfJ4cXGc9p26G550ZYXlCjHi4G47oF9Ve-OA2jHGCRI2dSB9bfuRkjWLPQbtZNj-FG3duTkqz-bX-JvDZPHID9WcDdILcOu0aktzBq0IGzToJVs7NW0n0-Xpyi1w4M5sjiZiOUX4ZddmqirwMfIHZm1iLRU1c2VJ9UAQU5fky3Xc_QyvRhBrGHpzfiiex8uyEz3IKQGgHPCHtndehcTdFXpFhXgWqxVas_25C82KRv51mnasaHzEp2EP0uz07xyhRwEoCXDobP9PKmxUeOaBtjVoJvlA3zI8trU5xce6uIqeOqlq12_LOR9B8Zipp1pEVYUjtj6ZVVem_7y9FY4akknMgP1YbOfgNRMon4S0G5sgMmiru6UMGtrENTcppXt6eoB7galpwOqaL9Haq_M8qEY9IrSLJSSlpm9RugIl-DsNEXm8rRaE4cM7xLnXf2Fe-TH_czW_uRDn1W03D0O5D8oz0HopqdnGwIfVCM3em5MJkZ7tcWkw1QVOBf_YEod3JtlDxp1FHB3AhtZrhw5RMaU25d0-VsQrhpHEbl0K3sMSZTg7VZMVrLhIwhMN3KHIwM8-7LbLQEEPybKnsId_bjoOzLzjyelcGVYg7EPnbu0H74T2kSCF1rFcyvw_ZdIABMvUYvgNswzP_PeYDmLLnHJr9gg8eLAxdPcOhYrhsu0OEtpOf72rFkQUMs9e2iK2bU_JHUGuD6hJfc6368Erlb0aAOlJAGD7Rl6ueW4QzdA1FKh1tVguS9BzoF5vYjlzS7l9X_TGTPaEUkx42DU7FMGC0D_wOyhEm3OZ7vU9Te2fwk7GV4-k3A67bZ0bjdC9LsBClmJiW0qeSioRflRYIJcncJmqf8DyGSAzFfjSQ8XVuO8QCJm4P19NwVjYimtbSlpyigCCU03AHRSIePda2i7mzf4MKOuM0Be132p5QAS4CzGR-MvSeO-59TJ1iLFJfu8Jl-l4LdboST0FwaT8qNi3Lrr05A-DjrQFkhTGgOf4ZElTZUeMZZqK50BI3MDsmgNAWWj9VpM4vy2HGmbHDkyOG89FNm5yGZpalobW9mHNjlQq9zbBCH5foJQ5Vg-HDLc4ImQ=s1024-rj", alt: "Payday Sale" },
  { id: 6, src: "https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSkzG9y0gdfiY0GQx2wujpVuvMcaOA3dQ9_DQddoQGFPYVOtBODHL2i5hHSpnE6oV45FmZ1pFK-Buva76HIQt1fbY0Dm4gkD6YQ6lvCXwTuUaEkuiqSvLKYZ5blpMlD-yjbv6sJc93GnZ8xYYg5wSZ-fdH-uheeTLCvweXPQUyppam6EVtyL3EBI_pKVuvUUDr9-uiwJuFi2A8548grPZK9reUJdjH_at1oEk5Ce-TT3ZcxoX6voRUp0mqqkzfVsEQkmnA6qVA4JIaXSP5X6zyBG6yOaxpUPXba8GhXW9HJlRnpZQxevankrTj8A8gA9znIYppQnmPeHxHBofNhNKEMj_9y4xYoayw90JUpDNe71HIZoxYl7iOdlz3mpsFRYF4o45fahmcZV9tCEk2MKYpDljptIAX3lCpun6JwZzDPq45IdWHNXvNyoT6niw16LqdGGBVSI3zpHap1RuLH186dRiMCawEXZlhd0ejvmUM4nqe4ZqJHRmJE5diCNsHBdvNttxo8dLBbRp0oQqNaJG7KAofvJY7aRIpj9Bxdw6lFZJizIiOIZgBHsuiKGWLFbu1_7zwwNEMNc6TRkSElxTIPEKE4Y78OXTVjEQAX3j4MYKceKzHs68FyuktYdj1kmwKPNssifoHOfcSTHaQiAHzZtLsBxiOIPpfenTUV6MiQCEWk8GHT1imvcNaLGaLWvLtgSS18tYDX8QFf3BX_7RpGOIL4-WFWu8P-c-IVKDwToXHCjRPdWqjCVXvZJ8tmarEdip0B3YiPuLg-BT0nSHTTmpuxbxYo4w5RQ0kW9XYHPJW1j7KDkz-IgJC4Sekw_8YodtCfRSNPcoPtrDJAMg3RkMrEHjSEMo927nZreMpcas_Zc6jYqEY_QYpGJWr_K7f4FZHixJC98vs1OO2ao0dhis1fHTH1jC-qrxsfsPPORp_KUs63HfsWbFQDmJrzXUz5FGe-edVRBxDfyBwDJUNPAEFmSY3tQmz56L13SeB7eaKusmQl4LucbQtWqZ9ImISFqJH-3nyKqBRwhIqrETRUhf1jjwZwvpavP2tOOARQj_IvDfRW73etsr2U4ObnJd3TMEp-kN1WAdsDimApwOhw86hMJK2VxX3S9lFhybw3eHL15RhHSHodj2-Wmc-CX4k44Y9czGXRe0yYXO-PWW0sRQ5y_Qh85SQDOFGH7RvmZeqATHzHO3g2znlBgVwSJMsW3AZh9wFfhouuW5K4=s1024-rj", alt: "Payday Sale" },
];

const bottomPromotions = [
  { id: 1, src: "https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSluF4jTZPou62xOfkMeyotmfi_8Azvac1HOhUbU1lXxV1uvBJcqEP0gyNz2IReoulzqE49YeDVyuQoou3IapDIGtmkxaZgSHMsU7CuKaNtNz0UsvyFvuHTM3SZXtpYKhbCHynaa6G9-WoHOyJIhhq8eUQ2pc8d5plOpnftj_E7XwT6aE35ij-i-vCDkrtDxmMpM6JYPJAWyyX6IxNRAOfLQuNTw566dEnHRc12Kg4TafHEpk1aqFp35zkg2qn9XLK0WrqKsDkT6FSmPMCY8K_3j-VZUXSCIGysKwJXR_8SmGuLRcsKxXQs6HrmGC6C5jcdFT05K3VcABys1iuM0cn0XNvolX7Y1223AbRTOgrWWY97D5jnKGqsCPeb2TjQlU1BdMRGzwenh9Gc410CmxlfFbBS-lNbkqiWHEDgbdmdobEYLllyPwHJA810sPCruFFppn-kXY6dzKFtTsR96J9A6ZiulpbfUg758wFnKQ6Hi34wMPFO5XkpGG0UJU3PwhJ27eAScQmEYjUfUArmoO2SBoUY8iyWQahduxCm5_rEe3XiqeTCZ3jAFw6_kzit4qwnjWhOtjr1374HpWLRbbiWnWJmpl4Zewm3EUVDlNsOUGDQ_On1jPT5DJtCbMcUqDUCR2GWQNF_o37SSDoYrOhFlP4_XeCkrPJihhokjCkhePnjM05iziG69uc1GKHu-ppeYEaQo7MmXyHHhBW8Eyv289ApMmFidYcfakerOhrUzGBlpy5BiZarolKte6Csv3ShiXYunOFJe9nUEFJ6FyBHIIIzqMJmRaouUFKrsL3kyXXWaF5S2HaupVwdltmRYaxRs1B7Xu2KzaPHXvU_4Ax1wNKdGt40DrWwji0xoEIcqcR-WO9UNBDbJvKHTRHkIQ2Hznp-vk7IiPtR7e8qhMnlC0Er-z8Eic2E9II309-GWvOeVSQCxaR1GrqX4spQw3ZL4EA_dPdcQlxZNImRFVnDVb4yHwUzDsYo58oo12Ef6nhK_JD1RQDpM-FZ1lyeFniufLAJXcwu19KObhvKIdbsX41wq0H_8vU0FmFuyAGnxMpLN_T6tQiJGhDpGP9UGEjY36FCSXAkcM0Qq4-ADfXjLZ00vH6avBGA_EHF9JnMcj4gwLXpVvYbgysFe7p6BpsM7qMKyWBecefh7XNR0uXsRyCGtP639jw8M6RaoVVHgBXuOtn21-TPvzzvdzZ7QzZUi1-xoAShs32hekmI=s1024-rj", alt: "หนังสือขายดี" },
  { id: 2, src: "https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSlPA9UU8U9lLKM3D0vnqPd0ZJ1Ey2E-kcVbIsfHgO5eGy-ADQQEIeghyR0AEth6wf2sfH6N085YR_78a71OU42b_mF-0ho9O8ZeSKhXc_IZQvv91zfMePL-egw3euQ-0FP5Eom2u4FI8WyRBvF-C2yBAObEXjFPOBleyQG7jk4MPdy4nJFsHhczGKvQWykSVEtu3AOpReBiKvGb3WstmOHBn2OGxNvrAvs5i6NDUYkFZHpgR0RWi6RqpNfXs_YrN2aNtYCcClIaVwq1OQGrVUDyOvEgNdUiDbMt0TpQK5BysHBiMCOdUci3M-PqUnaC-xNE4B7MQOcEcV5t31V3nDjwSx2-90BNtdGnkkoJGqlB8zCRK4SAe7N0njNDgNLyGfUnOifBytUvbIpKK2i9AnCQVR9LBL-cgFFW6aCEOQRLkuFNMmsSkSFacq04uFkTJNSk4APIIgHa7g6RbxwBZrZdAlduVounlOyPyBOqtKrdengpQSIfYp2u1i0URNyLEvO7VGsY8u2x0oueIzfr_nfcagm3Pfq8zY-YCjYgbKZE5OvlGB8dW6YlWOSpYybClpPPNYMEURQQgEKAYBRRmop3dY2BHcKoru0asD9nX5PW7fxRftZKpGeSP9qHIWB717a4_8385_M_gEoGTVO6mSNEbXLeNrIqdANw7hHRpBFDBLL0AMB9gGgGloisnzlGQ5WlX-vKa7fegJCR1OZTNfsKC36qUbggCvvLTb_8RuMcTqh9tQOXPUzn5555Rmeba18ar7vLAq0Nu8I6trh78CvAK3X924sG_odKTCbXsDLC6RkAlkDsBxiO3qHKssuFTiW2oJkpPxNyO_llW5Hn5WaNpntNqEy3HI1zPp__JNCG8_cjOEnd-PH3JESw_opOx6QFd_zCswHdvy5UbFBNu8U7Ijds7EKDMiYSNCnE45nTJowPjg0TdkxXho8RqEkggMAKyrCy94XanAG-CfV6EIhP9juDjsql40hmqth_5_dYcPCMvbE7oimkSCAADWUcjBOYUiH0RLBgKIkg9sts_vWz3hju7H37zjFRkWZFQ6kDaLF4XIKzwqqXhBkB00aO7Pod_2PykB4UL0ASV8mA_irvfvbIBGJI2Ucvk7TMUxv7ZMqPtONjF3wPaErr-AI4L8KarHHIHlfc9WZ5k_sMtmhTVaduwbhTlTM7RyMzRxxdJIq5JvhaK3ZwXd_57XIuh8yGXcIcObBDRpDGSQ=s1024-rj", alt: "ค้นหาสินค้าสาขา" },
  { id: 3, src: "https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSkgoZhvU7Ud4qePuJ8HcH9lFzh3vHV3p5qEwLEh-nmFaRgGm8go7wEXXyeMtawzZSVpR89pTy96U_rqvYLo2BOXI8kSeTV9NRZEhtWUftlzumODTFA0Tdal38wQrl3CDBnTrYb5VxLtq1-MBBC-yDGp-F4QS1W4Vqkep2CWX7f1uUjLW5CQA4v84gnnf1NsmsFVMW_jaBhIcUrbYG42-nGGYjmjJ_Ydm0oVzX956KWqHDti3uq52ncWIS5484TRXy5imqYAL3iozm5BrJaywpkUr8JHJCOmThmgehnQXc7Xoc1fqUo23LkNFftOQI3DS-JXFpwsgtx6IiIdCc2IQnBODBtUoTDCFSPLkKF8I8YstjhdJHcna8wCeGib3MFkh3mOkFfavZzYgiEerOX8IICf-CC74I-QDT3rjZc-9zrkkD2WRjbu0PoJohgFnAHSzF9IfxVmEyqIGoMTpuTEq-ro3jSB7Ntf27XOqWT5ESy0W21WvyR0hWgYUEkj5fmAL52l2fnUaWIestHPEUeqN-d7QzTpTxZVkDubESvkeq81cQD4UDzyqPqZdTibwiDXNx1JSpN57w_9ilLtK8GWgriwX0aDj1W-yID9gXn6Bbmd_SniaNKXdgdCbzpkVmUvUFVw7SiCAKf7M-QZPg70m8nqgX8H1ova-_MQPSFv4chbwMd_WESyKueTTYRWObpdz6jJcYDrJ1nXr55AbbxUsiHN7TdMHDe4otCPI-sPUSQmg8dM1ltCWkfv69sxzpMkSogp8LR29ycdzgkqyxcVxVCBh7YsEamuj-AhqXWqDqnYLEqdKkTCPWiJB3h1c0YSF6M3ik75XPJARDmZ-5sQN3IFnsoDJy4vIRVbReJ0MbgyW2HtIDw_Ej85fye-L-pt6_I02S_sVHE0rMg6vmhj6p-dk1cxFaA0_Gzjk5oAzFVSJtTKnG-nb3dC8sOiJPmEyXqHlV2sXT6cjHnJX61VyWtKaSnfT8Vx7rLvMmslNbLnN_d6c2FOlA8raveTuE8BsOe-Pm3zsn7W3B05Ko1gvLDDSu9bDh7JiDaGXggBJU3qf8Wt9sTfBZ35XpyuyFVuPFBgyZV_eTCMXgyUBKxCZbLbYtAE2mSZBftYwSVL8YUtEtaA_IQCAWAgX9YAx4ybA3-LxZ_tirheUtF_bNdaMNJ5N54vJ9zzgmOVv__B2jn8vrWBsqLptOG1a_1kekh72CGX3SSvCKU2mzzDMw=s1024-rj", alt: "สั่งซื้อออนไลน์" },
];

// --- ICONS ---

// 1. Arrow Right Icon
const ArrowRightIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2} 
    stroke="currentColor" 
    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

// 2. Star Icon (Solid)
const StarIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-6 h-6 text-yellow-400" 
  >
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

const HomePage: React.FC = () => {
  const { loading, error } = useBooks();
  const [bannerIndex, setBannerIndex] = useState(0);
  
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [newArrivalBooks, setNewArrivalBooks] = useState<Book[]>([]); 
  const [loadingData, setLoadingData] = useState(true);
  
  const navigate = useNavigate();

  const handleDotClick = (index: number) => {
    setBannerIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [recData, newData] = await Promise.all([
            booksAPI.getRecommended(),
            booksAPI.getAll()
        ]);
        setRecommendedBooks(recData);
        const recommendedIds = new Set(recData.map(book => book.id));
        const filteredNewBooks = newData.filter(book => !recommendedIds.has(book.id));
        setNewArrivalBooks(filteredNewBooks);
      } catch (err) {
        console.error('Failed to fetch books:', err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner size="large" className="py-20" />;
  if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <>
      <div className="pt-[150px]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to BookStore</h1>
        </div>

        {/* MAIN BANNER */}
        <div className="mb-10 container mx-auto px-4">
          <div className="relative w-full h-[250px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl bg-gray-200 group">
            <img
              src={bannerImages[bannerIndex].src}
              alt={bannerImages[bannerIndex].alt}
              className="w-full h-full object-cover transition-opacity duration-500"
              onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/1500x550?text=Main+Banner"; }}
            />
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`
                    h-2.5 rounded-full transition-all duration-300 shadow-sm
                    ${bannerIndex === index 
                      ? "w-8 bg-white opacity-100" 
                      : "w-2.5 bg-white/60 hover:bg-white/90 hover:scale-110"
                    }
                  `}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          
          {/* 1. RECOMMENDED SECTION */}
          {!loadingData && recommendedBooks.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                 {/* Blue Accent Line + Star */}
                 <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4 flex items-center gap-2">
                    Recommended
                    <StarIcon />
                 </h2>
                 <button 
                    onClick={() => navigate('/books')} 
                    className="text-blue-600 flex items-center gap-2 group font-medium hover:text-blue-700 transition-colors"
                  >
                    View All
                    <ArrowRightIcon />
                 </button>
              </div>
              <RecommendedBooksCarousel books={recommendedBooks} />
            </section>
          )}

          {/* PROMOTION SECTION */}
           <section className="mb-16 py-8 border-t border-b border-gray-100">
            {/* ✅ แก้ไข: เพิ่ม border-l-4 (สีส้ม) และ pl-4 ให้โปรโมชั่น */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-4">
              โปรโมชั่น
            </h2>
            
            <div className="flex overflow-x-auto gap-4 pb-6 snap-x scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
              {topPromotions.map((promo) => (
                <div 
                  key={promo.id} 
                  className="w-40 h-40 md:w-60 md:h-60 flex-shrink-0 snap-center transition-transform hover:scale-105 relative rounded-2xl shadow-md overflow-hidden"
                >
                  <img src={promo.src} alt={promo.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {bottomPromotions.map((promo) => (
                <div key={promo.id} className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all h-48 md:h-64">
                    <img 
                    src={promo.src} 
                    alt={promo.alt} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 2. NEW ARRIVALS SECTION */}
          {!loadingData && newArrivalBooks.length > 0 && (
             <section className="mb-12">
               <div className="flex items-center justify-between mb-6">
                  {/* Emerald Accent Line */}
                  <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-emerald-500 pl-4">
                    New Arrivals
                  </h2>
                  <button 
                    onClick={() => navigate('/books?sort=newest')} 
                    className="text-emerald-600 flex items-center gap-2 group font-medium hover:text-emerald-700 transition-colors"
                  >
                    View All
                    <ArrowRightIcon />
                  </button>
               </div>
               <RecommendedBooksCarousel books={newArrivalBooks} />
             </section>
          )}

        </div>
      </div>
    </>
  );
};

export default HomePage;